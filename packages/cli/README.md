# @anki.md/cli

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@anki.md/cli.svg)](https://npmjs.org/package/@anki.md/cli)
[![License](https://img.shields.io/npm/l/@anki.md/cli.svg)](https://github.com/timgreen/Anki.md/blob/main/packages/cli/package.json)

@anki.md CLI `ankimd`.

# Usage

<!-- usage -->

```sh-session
$ npm install -g @anki.md/cli
$ ankimd COMMAND
running command...
$ ankimd (--version)
@anki.md/cli/0.0.1 linux-x64 node-v18.10.0
$ ankimd --help [COMMAND]
USAGE
  $ ankimd COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`ankimd help [COMMAND]`](#ankimd-help-command)
- [`ankimd sync FILE`](#ankimd-sync-file)

## `ankimd help [COMMAND]`

Display help for ankimd.

```
USAGE
  $ ankimd help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for ankimd.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.19/src/commands/help.ts)_

## `ankimd sync FILE`

Sync to Anki Desktop via AnkiConnect.

```
USAGE
  $ ankimd sync [FILE]

ARGUMENTS
  FILE  Markdown files

DESCRIPTION
  Sync to Anki Desktop via AnkiConnect.

EXAMPLES
  $ ankimd sync deckA.md

  $ ankimd sync deckA.md deckB.md
```

_See code: [dist/commands/sync.ts](https://github.com/timgreen/Anki.md/blob/v0.0.1/dist/commands/sync.ts)_

<!-- commandsstop -->
