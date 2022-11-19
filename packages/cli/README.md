# @anki.md/cli

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@anki.md/cli.svg)](https://npmjs.org/package/@anki.md/cli)
[![main](https://github.com/timgreen/Anki.md/actions/workflows/cli.yml/badge.svg?branch=main)](https://github.com/timgreen/Anki.md/actions/workflows/cli.yml)
[![License](https://img.shields.io/npm/l/@anki.md/cli.svg)](https://github.com/timgreen/Anki.md/blob/main/packages/cli/package.json)

@anki.md CLI `ankimd`.

# Usage

<!-- usage -->

```sh-session
$ npm install -g @anki.md/cli
$ ankimd COMMAND
running command...
$ ankimd (--version)
@anki.md/cli/0.2.1 linux-x64 node-v18.12.1
$ ankimd --help [COMMAND]
USAGE
  $ ankimd COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`ankimd autocomplete [SHELL]`](#ankimd-autocomplete-shell)
- [`ankimd help [COMMAND]`](#ankimd-help-command)
- [`ankimd sync FILE`](#ankimd-sync-file)

## `ankimd autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ ankimd autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  display autocomplete installation instructions

EXAMPLES
  $ ankimd autocomplete

  $ ankimd autocomplete bash

  $ ankimd autocomplete zsh

  $ ankimd autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v1.3.6/src/commands/autocomplete/index.ts)_

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

_See code: [dist/commands/sync.ts](https://github.com/timgreen/Anki.md/blob/@anki.md/cli@0.2.1/packages/cli/src/commands/sync.ts)_

<!-- commandsstop -->
