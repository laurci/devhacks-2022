import { FunctionMacro, getCurrentProgram, isMacroCallExpressionNode, Node, SourceFile, visitEachChild } from "compiler";
import * as Path from "path";
import { getGlobalInvokeExpression } from "./lib";

export macro function app(this: FunctionMacro, _listener: () => void | Promise<void>) {
    this.transform(({ node, factory }) => {
        node.replace(getGlobalInvokeExpression(factory, "init_app", [node.arguments[0]]));
    });
}


export macro function getAppFactories(this: FunctionMacro): { name: string, mod: () => void | Promise<void> }[] {
    this.transform(({ context, sourceFile, factory, node }) => {
        const program = getCurrentProgram();
        const files: SourceFile[] = [];
        for (const sourceFile of program.getSourceFiles()) {
            const visitor = (node: Node): Node => {
                if (isMacroCallExpressionNode(node) && node.expression.expression.escapedText == "app") {
                    files.push(sourceFile);

                    return node;
                }
                return visitEachChild(node, visitor, context);
            }
            visitEachChild(sourceFile, visitor, context);
        }

        const imports = files.map(file => {
            const importSpecifiers = `./${Path.relative(Path.dirname(sourceFile.fileName), file.fileName)}`.replace(".ts", "");
            return getGlobalInvokeExpression(factory, "load_app_from", [factory.createIdentifier("__dirname"), factory.createStringLiteral(importSpecifiers)]);
        });

        node.replace(factory.createArrayLiteralExpression(imports, true));
    });
}
