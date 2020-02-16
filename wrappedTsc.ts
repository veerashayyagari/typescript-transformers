import * as ts from "typescript";
import { transform } from "./transforms";

export default function compile(fileNames: string[], options: ts.CompilerOptions) {
  const compilerHost = ts.createCompilerHost(options);
  const program = ts.createProgram(fileNames, options, compilerHost);
  const msgs = {};
  const emitResult = program.emit(undefined, undefined, undefined, undefined, {
    before: [transform()]
  });

  let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

  allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
      let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
      console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    } else {
      console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    }
  });
  console.log("done compilng", emitResult.emittedFiles);
  let exitCode = emitResult.emitSkipped ? 1 : 0;
  console.log(`Process exiting with code '${exitCode}'.`);
  process.exit(exitCode);
}

compile(process.argv.slice(2), {
  noEmitOnError: true,
  noImplicitAny: true,
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.ES2015,
  strict: true
});
