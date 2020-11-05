import os from "os";

export interface TranslationObjects {
	[key: string]: TranslationObject | TranslationObjects;
}

interface TranslationObject {
	key?: string;
	default?: string;
	description?: string;
	[key: string]: undefined | TranslationObject | string;
	[key: number]: string;
}

type TranslationRequest = TranslationObject | TranslationObjects;

export interface ProcessOptions {
	translationKeyProperty?: string;
	translationExport?: string;
}

export const processTranslationFile = (
	file: string,
	write: (msg: string) => void,
	{
		translationKeyProperty = "key",
		translationExport = "translations",
	}: ProcessOptions = {},
) => {
	// eslint-disable-next-line import/no-dynamic-require, global-require
	const translations = require(file)[translationExport];

	const isTranslationObject = (data: unknown): data is TranslationObject => {
		return typeof (data as any)[translationKeyProperty] === "string";
	}

	const processTranslation = (translation: TranslationRequest) => {
		if (!translation) {
			return;
		}

		(Array.from(Object.keys(translation)))
			.forEach((translationKey) => {
				const translationObject = translation[translationKey];
				if (isTranslationObject(translationObject)) {
					const key = translationObject[translationKeyProperty];

					delete translationObject[translationKeyProperty];

					const {
						default: defaultContent,
						description,
						...replacements
					} = translationObject;

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
					const nextTranslation = translation[translationKey];
					if (nextTranslation && isTranslationObject(nextTranslation)) {
						processTranslation(nextTranslation);
					}
				}
			});
	};

	processTranslation(translations);
};
