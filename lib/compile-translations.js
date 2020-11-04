const ts = require("typescript");

const compileTranslations = ({
	overrideTscCompilerOptions = {},
	fileNames,
	outDir,
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
		incremental: true,
	});

	const result = program.emit();

	return result.emittedFiles;
};

module.exports = {
	compileTranslations,
};
