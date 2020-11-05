import ts from "typescript";

export const compileTranslations = ({
	overrideTscCompilerOptions = {},
	fileNames,
	outDir,
}: {
	overrideTscCompilerOptions?: ts.CompilerOptions;
	fileNames: readonly string[];
	outDir: string;
}) => {
	const defaultTscCompilerOptions = {
		lib: [],
		module: ts.ModuleKind.CommonJS,
		moduleResolution: ts.ModuleResolutionKind.NodeJs,
		outDir,
		listEmittedFiles: true,
		target: ts.ScriptTarget.ES3,
	};

	const compilerOptions = Object.assign(
		{},
		defaultTscCompilerOptions,
		overrideTscCompilerOptions,
	);
	const program = ts.createProgram({
		options: compilerOptions,
		rootNames: fileNames,
	});

	const result = program.emit();

	return result.emittedFiles;
};
