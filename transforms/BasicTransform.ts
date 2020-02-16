import * as ts from "typescript";

function visitor(ctx: ts.TransformationContext) {
  const visitor: ts.Visitor = (node: ts.Node): ts.VisitResult<ts.Node> => {
    console.log("Visiting Node", node);
    if (ts.isCallExpression(node)) {
      debugger;
      const calleeExpression = node.expression;
      const target = node.arguments[0];
      if (ts.isIdentifier(calleeExpression) && calleeExpression.text == "safely") {
        return ts.createBinary((target as ts.PropertyAccessExpression).expression, ts.SyntaxKind.AmpersandAmpersandToken, target);
      }
    }
    return ts.visitEachChild(node, visitor, ctx);
  };

  return visitor;
}

export default function(/*opts?: Opts*/) {
  return (ctx: ts.TransformationContext): ts.Transformer<ts.SourceFile> => {
    return (sf: ts.SourceFile) => ts.visitNode(sf, visitor(ctx));
  };
}
