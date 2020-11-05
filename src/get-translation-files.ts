const glob = require("glob");

const getTranslationFiles = ({
	globPattern = "**/**/translations.ts",
	globOptions,
}: {
	globPattern?: string;
	globOptions: any;
}) => {
	const defaultOptions = {
		absolute: true,
		cwd: process.cwd(),
	};

	return new Promise((resolve) => {
		glob(
			globPattern,
			{ ...defaultOptions, ...globOptions },
			(
				er: any,
				files: string[],
			) => {
				if (er) {
					console.error(er);
					resolve(undefined);
				} else {
					if (!files || !files.length) {
						console.warn(`No files found for '${globPattern}'.`);
						resolve(undefined);
					}

					resolve(files);
				}
			},
		);
	});
};

module.exports = {
	getTranslationFiles,
};
