import { FunctionMacro, getAllJSDocTags, getCurrentProgram, InterfaceDeclaration, isInterfaceDeclaration, JSDoc, JSDocAllType, JSDocTag, Symbol, Type, TypeChecker } from "compiler";
import { getGlobalInvokeExpression } from "./lib";
import * as Path from "path";
import * as Fs from "fs";

interface Packer<T> {
    id: number;
    pack(value: T): ArrayBuffer;
    unpack(buffer: ArrayBuffer, offset?: number): T;
}

const typeMap = {
    "uint8": "B",
    "uint16": "H",
    "uint32": "I",
    "int8": "b",
    "int16": "h",
    "int32": "i",
    "float": "f",
    "double": "d",
    "bool": "?",
    "char": "c",
}

const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

function parseType(checker: TypeChecker, rootType: Type): {
    formatString: string, propsOrder: string[], props: {
        name: string;
        type: keyof typeof typeMap;
    }[]
} {
    const properties = ((rootType as any).properties ?? []) as Symbol[];

    const props: {
        name: string;
        type: keyof typeof typeMap;
    }[] = [];

    for (const property of properties) {
        if (!property.valueDeclaration) {
            continue;
        }
        const type = checker.getTypeAtLocation(property.valueDeclaration);
        const typeName = checker.typeToString(type);

        if (!(typeName in typeMap)) {
            throw new Error(`Unsupported type ${typeName}`);
        }

        props.push({
            name: property.escapedName.toString(),
            type: typeName as keyof typeof typeMap,
        });
    }

    // ESP32 is little endian. (<)
    const formatString = `<${props.map(p => typeMap[p.type]).join("")}`;
    const propsOrder = props.map(p => p.name);

    return {
        formatString,
        propsOrder,
        props
    }
}

export macro function packer<T>(this: FunctionMacro): Packer<T> {
    this.transform(({ node, factory }) => {
        const program = getCurrentProgram();
        const checker = program.getTypeChecker();
        const firstArg = node.typeArguments?.[0];
        if (!firstArg) {
            throw new Error("packer must have a type argument");
        }

        const rootType = checker.getTypeAtLocation(firstArg);
        const { formatString, propsOrder } = parseType(checker, rootType);

        const decl = rootType.symbol?.declarations?.find(isInterfaceDeclaration);
        if (!decl || !isInterfaceDeclaration(decl)) {
            throw new Error("packer must be used on an interface");
        }

        const tags = getAllJSDocTags(decl, (tag): tag is JSDocTag => tag.tagName.escapedText === "packer");
        if (tags.length === 0) {
            throw new Error("Interface must have a @packer tag");
        }

        const tag = tags[0]!;

        if (typeof tag.comment !== "string") {
            throw new Error("Expected @packer tag to have a string comment");
        }

        const packerTag = eval(`(${tag.comment})`) as PackerTag;
        if (typeof packerTag !== "object") {
            throw new Error("Expected @packer tag to contain an object");
        }

        node.replace(getGlobalInvokeExpression(factory, "make_packer", [
            factory.createNumericLiteral(packerTag.id),
            factory.createStringLiteral(formatString),
            factory.createArrayLiteralExpression(propsOrder.map(p => factory.createStringLiteral(p)), false),
        ]))
    });
}

interface PackerTag {
    id: number;
}


export macro function exportCStruct(this: FunctionMacro) {
    this.transform(({ }) => {
        const program = getCurrentProgram();
        const checker = program.getTypeChecker();


        const protoFiles = program.getSourceFiles().filter(f => f.fileName.includes(".proto"));
        console.log("proto files:", protoFiles.map(x => x.fileName));

        let output = `// This code was generated from .proto.ts files.
// Do not edit this file directly if you don't know what you're doing.
// To regenerate this file, run "yarn proto:exportc" in the root directory.

#include <stdint.h>

`;

        for (let sourceFile of protoFiles) {
            const interfaceDeclarations = sourceFile.statements.filter(x => isInterfaceDeclaration(x)) as InterfaceDeclaration[];
            for (let interfaceDeclaration of interfaceDeclarations) {
                const type = checker.getTypeAtLocation(interfaceDeclaration);
                const tags = getAllJSDocTags(interfaceDeclaration, (tag): tag is JSDocTag => tag.tagName.escapedText === "packer");
                if (tags.length === 0) {
                    throw new Error("Interface must have a @packer tag");
                }

                const tag = tags[0]!;

                if (typeof tag.comment !== "string") {
                    throw new Error("Expected @packer tag to have a string comment");
                }

                const packerTag = eval(`(${tag.comment})`) as PackerTag;
                if (typeof packerTag !== "object") {
                    throw new Error("Expected @packer tag to contain an object");
                }

                const { props } = parseType(checker, type);

                output += `typedef struct {\n`;
                for (const prop of props) {
                    output += `    ${prop.type}_t ${prop.name};\n`;
                }
                output += `} ${type.symbol.escapedName};\n`;
                output += `#define ID${camelToSnakeCase(type.symbol.escapedName.toString()).toUpperCase()} ${packerTag.id}\n`;

                output += "\n";
            }
        }

        const outputPath = Path.join(program.getCurrentDirectory(), "../firmware/include", "proto.h");
        if (!Fs.existsSync(Path.dirname(outputPath))) {
            Fs.mkdirSync(Path.dirname(outputPath), { recursive: true });
        }

        Fs.writeFileSync(outputPath, output.trim());
    });
}
