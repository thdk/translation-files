# Translation files

Node utility tool to extract translation files from typescript source code and output them in a human readable format so they can be sent to translation services.

## Install

You can find this package from [npm](https://www.npmjs.com/package/translation-files)

`npm install translation-files`

## Usage

```javascript
// src/todo-list/translations.ts
export const translations = {
    todo: {
        key: "page.title.todo",
        default: "Todo",
        description: "Displayed as page title",
    },
    completed: {
        key: "todo-list.completed.message",
        default: "You have finished {0}/{1} items of your todo list.",
        0: "Number of finished todo items",
        1: "Number of unfinished todo items",
    }
}
```

```javascript
// src/todo-list/translations.tsx
import { translations } from "./translations";

export const TodoList = ({
    getTranslationByKey,
}: {
    // this part you need to provide yourself :)
    getTranslationByKey: (key: string) => string;
}) => {
    const todoText = getTranslationByKey(
        translations.todo,
    );

    let completedText = getTranslationByKey(
        translations.completed,
    );

    const totalTodos = 10;
    const completedTodos = 3;

    // dummy function to replace {0} and {1} with values
    completedText = format(
        completedText,
        completedTodos,
        totalTodos,
    );

    return (
        <>
        <header>
            <h1>{todoText}</h1>
        </header>
        <div className="todo-list">
            ...
            <p>{}
        </div>
        </>
    );
});

```
You can use it as follows. In your `package.json`, add a new script to run:
```
  "scripts": {
    "translations": "translation-files",
  },
  ```
  Then when you run `npm run translations` it will output a translation file with default settings.

  Example of the output for the *translations.ts* file listed above:

```sh
key:            page.title.todo
description:    Displayed as page title
default:        Todo

key:            todo-list.completed.message
default:        You have finished {0}/{1} items of your todo list.
                    0: Number of finished todo items
                    1: Number of unfinished todo items
```

You can modify the npm script to your needs using the following cli options:


```shell
Usage: translation-files [options]

Options:
  --pattern [globPattern]  Pattern (glob) to used to find translation files. (default: "**/**/translations.ts")
  --outFile [file]         File where translations should be saved to.
  --exportName [var]       Name of exported root variable used in each source translation file. (default: "translations")
  --keyName [prop]         Name of property containing the key for translation (default: "key")
  --cwd [cwd]              Current working directory
  -h, --help               display help for command
```

**Javascript API**

This package can also be used by it's javascript API.

```javascript
const {
    extractTranslations,
} = require('translation-files');

// with default settings:
extractTranslations();

// or with custom settings:
extractTranslations({
    globOptions: {
        cwd: __dirname, // default process.cwd()
    },
    globPattern, // default "**/**/translations.ts"
    processOptions: {
        translationKeyProperty: "label", // default "key"
        translationExport: "labels", // default "translations"
    },
    outFile: "dist/labels.txt", // default undefined (output in console)
});
```