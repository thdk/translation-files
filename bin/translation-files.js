#!/usr/bin/env node

const { program } = require('commander');

const { extractTranslations } = require('../lib/main');

program
    .option(
        '--pattern [globPattern]',
        'Pattern (glob) to used to find translation files.',
        '**/**/translations.ts',
    )
    .option('--outFile [file]', 'File where translations should be saved to.')
    .option(
        '--exportName [var]',
        'Name of exported root variable used in each source translation file.',
        'translations',
    )
    .option('--keyName [prop]', 'Name of property containing the key for translation', 'key')
    .option('--cwd [cwd]', 'Current working directory');

program.parse(process.argv);

extractTranslations({
    globPattern: program.pattern,
    labelFile: program.hashFilename,
    translationFile: program.outFile,
    outFile: program.outFile,
    processOptions: {
        translationKeyProperty: program.keyName,
        translationExport: program.exportName,
    },
    globOptions: {
        cwd: program.cwd || process.cwd(),
    },
});
