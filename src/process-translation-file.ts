import os from 'os';
import { processTranslation } from './process-translation';

export interface ProcessOptions {
    translationKeyProperty?: string;
    translationExport?: string;
}

export const processTranslationFile = (
    file: string,
    write: (msg: string) => void,
    { translationKeyProperty = 'key', translationExport = 'translations' }: ProcessOptions = {},
): void => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const translations = require(file)[translationExport];

    processTranslation(translations, write, translationKeyProperty, os.EOL, '\\t');
};
