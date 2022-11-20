import { ArrowFunction, Block, ClassDeclaration, FunctionExpression, FunctionMacro, getCurrentProgram, isArrowFunction, isFunctionExpression, isLiteralTypeNode, isStringLiteral, NodeFactory, SyntaxKind, UsingMacro } from "compiler";
import { BaseActor } from "src/lib/actor";
import { BaseMessage } from "src/lib/broker";
import { getGlobalInvokeExpression } from "./lib";

export macro function actor<T extends BaseActor>(this: FunctionMacro, _handler_func: (self: T) => void) {
    this.transform(({ node, factory }) => {
        const program = getCurrentProgram();
        const checker = program.getTypeChecker();

        const type = checker.getTypeAtLocation(node.typeArguments![0]);
        const decl = type.symbol.valueDeclaration as ClassDeclaration;
        if (!decl) return;

        const extendTypeNode = decl.heritageClauses?.flatMap(x => x.token == 94 /* SyntaxKind.ExtendsKeyword */ ? x.types : [])?.[0];
        if (!extendTypeNode) return;

        const typeArgument = extendTypeNode.typeArguments?.[0];
        if (!typeArgument || !isLiteralTypeNode(typeArgument)) return;
        const literal = typeArgument.literal;
        if (!isStringLiteral(literal)) return;

        const actorType = literal.text;

        node.replace(getGlobalInvokeExpression(factory, "make_actor_type", [factory.createStringLiteral(actorType), node.arguments[0]]));
    });
}


export macro function message<T extends BaseMessage = BaseMessage>(this: FunctionMacro, _handler: (message: T) => Promise<void> | void) {
    this.transform(({ node, factory, sourceFile }) => {
        const program = getCurrentProgram();
        const checker = program.getTypeChecker();

        let handler: string | undefined;
        if (!node.typeArguments?.length) {
            handler = "*";
        } else {
            const type = checker.getTypeAtLocation(node.typeArguments![0]);
            const decl = type.symbol.valueDeclaration as ClassDeclaration;
            if (!decl) return;

            const extendTypeNode = decl.heritageClauses?.flatMap(x => x.token == 94 /* SyntaxKind.ExtendsKeyword */ ? x.types : [])?.[0];
            if (!extendTypeNode) return;

            const typeArgument = extendTypeNode.typeArguments?.[0];
            if (!typeArgument || !isLiteralTypeNode(typeArgument)) return;
            const literal = typeArgument.literal;
            if (!isStringLiteral(literal)) return;

            handler = literal.text;
        }

        if (!handler) return;

        node.replace(factory.createCallExpression(
            factory.createIdentifier("self.addHandle"),
            [],
            [factory.createStringLiteral(handler), node.arguments[0]!]
        ));
    });
}
