import { glob, IOptions } from 'glob';

export const getTranslationFiles = ({
    globPattern = '**/**/translations.ts',
    globOptions,
}: {
    globPattern?: string;
    globOptions: IOptions;
}): Promise<string[] | undefined> => {
    const defaultOptions: IOptions = {
        absolute: true,
        cwd: process.cwd(),
    };

    return new Promise<string[] | undefined>((resolve) => {
        glob(globPattern, { ...defaultOptions, ...globOptions }, (er: unknown, files: string[]) => {
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
        });
    });
};
