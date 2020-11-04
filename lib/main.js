const path = require("path");
const del = require("del");

const fs = require("fs");

const {
	processTranslationFile,
} = require("./process-translation-file");

const {
	compileTranslations,
} = require("./compile-translations");

const {
	getTranslationFiles,
} = require("./get-translation-files");

const run = ({
	files,
	cwd,
	write = (msg) => console.log(msg.trim()),
	tempDir,
	processOptions,
}) => {
	const outDir = path.resolve(cwd, tempDir);

	const compiledTranslations = compileTranslations({
		fileNames: files,
		outDir,
	});

	compiledTranslations.forEach(
		(file) => processTranslationFile(
			path.resolve(cwd, file),
			write,
			processOptions,
		),
	);

	// remove temporary compiled label files
	del.sync(
		outDir,
	);
};

const extractTranslations = async ({
	globPattern = "**/**/translations.ts",
	globOptions = {},
	translationFile = undefined,
	processOptions,
	tempDir = ".translations",
}) => {
	const files = await getTranslationFiles({
		globOptions,
		globPattern,
	});

	if (!files) {
		return;
	}

	const cwd = globOptions.cwd || process.cwd();

	if (translationFile) {
		// ensure dir exists before making writable stream
		const translationFilePath = path.resolve(cwd, translationFile);
		const folder = path.dirname(translationFilePath);
		fs.mkdirSync(folder, { recursive: true });

		const stream = fs.createWriteStream(
			translationFilePath,
			{
				autoClose: true,
			},
		);

		console.log(`Writing to: ${translationFilePath}`);

		stream.once("open", () => {
			run({
				files,
				stream,
				cwd,
				write: (msg) => stream.write(msg),
				processOptions,
				tempDir,
			});
		});

	}
	else {
		run({
			files,
			cwd,
			processOptions,
			tempDir,
		});
	}
};

module.exports = {
	extractTranslations,
};
