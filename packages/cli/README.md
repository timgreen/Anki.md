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
- [`ankimd plugins`](#ankimd-plugins)
- [`ankimd plugins:install PLUGIN...`](#ankimd-pluginsinstall-plugin)
- [`ankimd plugins:inspect PLUGIN...`](#ankimd-pluginsinspect-plugin)
- [`ankimd plugins:install PLUGIN...`](#ankimd-pluginsinstall-plugin-1)
- [`ankimd plugins:link PLUGIN`](#ankimd-pluginslink-plugin)
- [`ankimd plugins:uninstall PLUGIN...`](#ankimd-pluginsuninstall-plugin)
- [`ankimd plugins:uninstall PLUGIN...`](#ankimd-pluginsuninstall-plugin-1)
- [`ankimd plugins:uninstall PLUGIN...`](#ankimd-pluginsuninstall-plugin-2)
- [`ankimd plugins update`](#ankimd-plugins-update)
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

## `ankimd plugins`

List installed plugins.

```
USAGE
  $ ankimd plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ ankimd plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.7/src/commands/plugins/index.ts)_

## `ankimd plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ ankimd plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ ankimd plugins add

EXAMPLES
  $ ankimd plugins:install myplugin

  $ ankimd plugins:install https://github.com/someuser/someplugin

  $ ankimd plugins:install someuser/someplugin
```

## `ankimd plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ ankimd plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ ankimd plugins:inspect myplugin
```

## `ankimd plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ ankimd plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ ankimd plugins add

EXAMPLES
  $ ankimd plugins:install myplugin

  $ ankimd plugins:install https://github.com/someuser/someplugin

  $ ankimd plugins:install someuser/someplugin
```

## `ankimd plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ ankimd plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ ankimd plugins:link myplugin
```

## `ankimd plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ ankimd plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ankimd plugins unlink
  $ ankimd plugins remove
```

## `ankimd plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ ankimd plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ankimd plugins unlink
  $ ankimd plugins remove
```

## `ankimd plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ ankimd plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ankimd plugins unlink
  $ ankimd plugins remove
```

## `ankimd plugins update`

Update installed plugins.

```
USAGE
  $ ankimd plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

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
