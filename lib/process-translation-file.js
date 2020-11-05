const os = require("os");

const processTranslationFile = (
	file,
	write,
	{
		translationKeyProperty = "key5",
		translationExport = "translations",
	},
) => {
	// eslint-disable-next-line import/no-dynamic-require, global-require
	const translations = require(file)[translationExport];

	const processTranslation = (translation) => {
		if (!translation) {
			return;
		}

		Array.from(Object.keys(translation))
			.forEach((translationKey) => {
				if (typeof translation[translationKey][translationKeyProperty] !== "undefined") {
					const key = translation[translationKey][translationKeyProperty];

					delete translation[translationKey][translationKeyProperty];

					const {
						default: defaultContent,
						description,
						...replacements
					} = translation[translationKey];

					write(`key:\t${key}${os.EOL}`);
					if (description) {
						write(`description:\t${description}${os.EOL}`);
					}
					write(`default:\t${defaultContent}${os.EOL}`);

					if (Object.keys(replacements).length) {
						let counter = 0;
						for (const replacement in replacements) {
							if (typeof replacement === "string") {
								write(`\t${counter}: ${replacements[replacement]}${os.EOL}`);
								counter += 1;
							}
						}
					}
					write(os.EOL);
				} else {
					processTranslation(translation[translationKey]);
				}
			});
	};

	processTranslation(translations);
};

module.exports = {
	processTranslationFile,
};
