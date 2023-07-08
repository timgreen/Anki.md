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
@anki.md/cli/0.7.2 linux-x64 node-v18.16.1
$ ankimd --help [COMMAND]
USAGE
  $ ankimd COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`ankimd autocomplete [SHELL]`](#ankimd-autocomplete-shell)
- [`ankimd connect deckNames`](#ankimd-connect-decknames)
- [`ankimd connect findNotes QUERY`](#ankimd-connect-findnotes-query)
- [`ankimd connect getMediaFilesNames [PATTERN]`](#ankimd-connect-getmediafilesnames-pattern)
- [`ankimd connect getProfiles`](#ankimd-connect-getprofiles)
- [`ankimd connect loadProfile NAME`](#ankimd-connect-loadprofile-name)
- [`ankimd connect notesInfo NOTEIDS`](#ankimd-connect-notesinfo-noteids)
- [`ankimd connect sync`](#ankimd-connect-sync)
- [`ankimd help [COMMANDS]`](#ankimd-help-commands)
- [`ankimd sync MARKDOWNS`](#ankimd-sync-markdowns)

## `ankimd autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ ankimd autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  (zsh|bash|powershell) Shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  display autocomplete installation instructions

EXAMPLES
  $ ankimd autocomplete

  $ ankimd autocomplete bash

  $ ankimd autocomplete zsh

  $ ankimd autocomplete powershell

  $ ankimd autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v2.3.1/src/commands/autocomplete/index.ts)_

## `ankimd connect deckNames`

Gets the complete list of deck names for the current user.

```
USAGE
  $ ankimd connect deckNames [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Gets the complete list of deck names for the current user.

EXAMPLES
  $ ankimd connect deckNames
```

## `ankimd connect findNotes QUERY`

Returns an array of note IDs for a given query.

```
USAGE
  $ ankimd connect findNotes QUERY [--json]

ARGUMENTS
  QUERY  Query syntax: https://docs.ankiweb.net/searching.html.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Returns an array of note IDs for a given query.

EXAMPLES
  $ ankimd connect findNotes findNotes deck:current

  $ ankimd connect findNotes findNotes 'deck:"a b"'
```

## `ankimd connect getMediaFilesNames [PATTERN]`

Gets the names of media files matched the pattern. Returning all names by default.

```
USAGE
  $ ankimd connect getMediaFilesNames [PATTERN] [--json]

ARGUMENTS
  PATTERN  Pattern

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Gets the names of media files matched the pattern. Returning all names by default.

EXAMPLES
  $ ankimd connect getMediaFilesNames getMediaFilesNames

  $ ankimd connect getMediaFilesNames getMediaFilesNames pattern
```

## `ankimd connect getProfiles`

Retrieve the list of profiles.

```
USAGE
  $ ankimd connect getProfiles [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Retrieve the list of profiles.

EXAMPLES
  $ ankimd connect getProfiles
```

## `ankimd connect loadProfile NAME`

Selects the profile specified in request.

```
USAGE
  $ ankimd connect loadProfile NAME

ARGUMENTS
  NAME  Profile name

DESCRIPTION
  Selects the profile specified in request.

EXAMPLES
  $ ankimd connect loadProfile profile1
```

## `ankimd connect notesInfo NOTEIDS`

Returns a list of objects containing for each note ID the note fields, tags, note type and the cards belonging to the note.

```
USAGE
  $ ankimd connect notesInfo NOTEIDS [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Returns a list of objects containing for each note ID the note fields, tags, note type and the cards belonging to the
  note.

EXAMPLES
  $ ankimd connect notesInfo notesInfo 123

  $ ankimd connect notesInfo notesInfo 123 456
```

## `ankimd connect sync`

Synchronizes the local Anki collections with AnkiWeb.

```
USAGE
  $ ankimd connect sync

DESCRIPTION
  Synchronizes the local Anki collections with AnkiWeb.

EXAMPLES
  $ ankimd connect sync
```

## `ankimd help [COMMANDS]`

Display help for ankimd.

```
USAGE
  $ ankimd help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for ankimd.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.11/src/commands/help.ts)_

## `ankimd sync MARKDOWNS`

Sync to Anki Desktop via AnkiConnect.

```
USAGE
  $ ankimd sync MARKDOWNS [--math native|svg] [--update-model-templates] [--update-model-styling]
    [--overwrite-existing-medias]

ARGUMENTS
  MARKDOWNS  Markdown files

FLAGS
  --math=<option>              [default: native] render math equations as SVG or use Anki native mathjax support.
                               <options: native|svg>
  --overwrite-existing-medias  Replace the existing medias with the same name during sync.
  --update-model-styling       update the styling for the existing note models.
  --update-model-templates     update the card templates for the existing note models.

DESCRIPTION
  Sync to Anki Desktop via AnkiConnect.

EXAMPLES
  $ ankimd sync deckA.md

  $ ankimd sync deckA.md deckB.md

  $ ankimd sync deckA.md https://example.com/foo/deckB.md
```

_See code: [dist/commands/sync.ts](https://github.com/timgreen/Anki.md/blob/cli/v0.7.2/packages/cli/src/commands/sync.ts)_

<!-- commandsstop -->
