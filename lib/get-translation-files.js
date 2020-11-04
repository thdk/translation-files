const glob = require("glob");

const getTranslationFiles = ({
	globPattern = "**/**/translations.ts",
	globOptions,
}) => {
	const defaultOptions = {
		absolute: true,
		cwd: process.cwd(),
	};

	return new Promise((resolve) => {
		glob(
			globPattern,
			{ ...defaultOptions, ...globOptions },
			(er, files) => {
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
