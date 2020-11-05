import path from "path";
import del from "del";
import fs from "fs";

import { IOptions as GlobOptions } from "glob";

import {
	ProcessOptions,
	processTranslationFile,
} from "./process-translation-file";

import {
	compileTranslations,
} from "./compile-translations";

import {
	getTranslationFiles,
} from "./get-translation-files";

const run = ({
	files,
	cwd,
	write = (msg) => console.log(msg.trim()),
	tempDir,
	processOptions,
}: {
	files: readonly string[];
	cwd: string;
	write?(msg: string): void;
	tempDir: string;
	processOptions: ProcessOptions;
}) => {
	const outDir = path.resolve(cwd, tempDir);

	const compiledTranslations = compileTranslations({
		fileNames: files,
		outDir,
	});

	if (compiledTranslations) {
		compiledTranslations.forEach(
			(file: string) => processTranslationFile(
				path.resolve(cwd, file),
				write,
				processOptions,
			),
		);

		// remove temporary compiled label files
		del.sync(
			outDir,
		);
	}
};

export const extractTranslations = async ({
	globPattern = "**/**/translations.ts",
	globOptions = {},
	outFile = undefined,
	processOptions,
	tempDir = ".translations",
}: {
	globPattern?: string;
	globOptions?: GlobOptions;
	outFile?: string;
	processOptions: ProcessOptions;
	tempDir?: string;
}) => {
	const files = await getTranslationFiles({
		globOptions,
		globPattern,
	});

	if (!files) {
		return;
	}

	const cwd = globOptions.cwd || process.cwd();

	if (outFile) {
		// ensure dir exists before making writable stream
		const outFilePath = path.resolve(cwd, outFile);
		const folder = path.dirname(outFilePath);
		fs.mkdirSync(folder, { recursive: true });

		const stream = fs.createWriteStream(
			outFilePath,
			{
				autoClose: true,
			},
		);

		console.log(`Writing to: ${outFilePath}`);

		stream.once("open", () => {
			run({
				files,
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
