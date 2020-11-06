interface TranslationObjects {
    [key: string]: TranslationObject | TranslationObjects;
}

type TranslationObject =
    | string
    | {
          key?: string;
          default?: string;
          description?: string;
          [key: string]: undefined | TranslationObject | string;
          [key: number]: string;
      };

type Write = (msg: string) => void;
type TranslationRequest = Exclude<TranslationObject, string> | TranslationObjects;

const processTranslationObject = (
    translationObject: TranslationObject,
    translationKeyProperty: string,
    write: Write,
    newLine: string,
    tab: string,
) => {
    if (typeof translationObject === 'string') {
        write(`key:${tab}${translationObject}`);
        return;
    }

    const key = translationObject[translationKeyProperty];

    delete translationObject[translationKeyProperty];

    const { default: defaultContent, description, ...replacements } = translationObject;

    write(`key:${tab}${key}${newLine}`);
    if (description) {
        write(`description:${tab}${description}${newLine}`);
    }
    write(`default:${tab}${defaultContent}${newLine}`);

    if (Object.keys(replacements).length) {
        for (const replacement in replacements) {
            write(`${tab}${tab}${replacement}${tab}${replacements[replacement]}${newLine}`);
        }
    }
    write(newLine);
};

export const processTranslation = (
    translation: TranslationRequest,
    write: (msg: string) => void,
    translationKeyProperty: string,
    newLine: string,
    tab: string,
): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isTranslationObject = (data: any): data is TranslationObject => {
        return typeof data === 'string' || typeof data[translationKeyProperty] === 'string';
    };

    Array.from(Object.keys(translation)).forEach((translationKey) => {
        const translationObject = translation[translationKey] as TranslationObject;
        if (isTranslationObject(translationObject)) {
            processTranslationObject(
                translationObject,
                translationKeyProperty,
                write,
                newLine,
                tab,
            );
        } else {
            Array.from(Object.keys(translationObject)).forEach((translationKey) => {
                const nextTranslation = translationObject[translationKey];
                if (isTranslationObject(nextTranslation)) {
                    processTranslationObject(
                        nextTranslation,
                        translationKeyProperty,
                        write,
                        newLine,
                        tab,
                    );
                } else {
                    processTranslation(
                        nextTranslation,
                        write,
                        translationKeyProperty,
                        newLine,
                        tab,
                    );
                }
            });
        }
    });
};
