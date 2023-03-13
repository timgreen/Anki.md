# Changelog

## [0.7.0](https://github.com/timgreen/Anki.md/compare/cli/v0.6.4...cli/v0.7.0) (2023-03-13)

### ⚠ BREAKING CHANGES

- stop matching noteId & report unmodified

### Features

- Stop matching noteId & report unmodified ([8226956](https://github.com/timgreen/Anki.md/commit/82269562bb30b638f6ef4451091c6aac4eb8bf6e))

## [0.6.4](https://github.com/timgreen/Anki.md/compare/cli/v0.6.3...cli/v0.6.4) (2023-03-12)

### Features

- **connect:** FindNotes ([2e00764](https://github.com/timgreen/Anki.md/commit/2e0076477ab7e1b877833558e293cef81cbbd21d))
- **connect:** NotesInfo ([10178a3](https://github.com/timgreen/Anki.md/commit/10178a36dc6c0f8d9e2c6bc8b6ff8446f0fa78bc))

## [0.6.3](https://github.com/timgreen/Anki.md/compare/cli/v0.6.2...cli/v0.6.3) (2023-03-12)

### Features

- Add color to the output ([ced955e](https://github.com/timgreen/Anki.md/commit/ced955e096d545ffd4d7fab67af17a51ea576b44)), closes [#12](https://github.com/timgreen/Anki.md/issues/12)

## [0.6.2](https://github.com/timgreen/Anki.md/compare/cli/v0.6.1...cli/v0.6.2) (2023-03-10)

### Bug Fixes

- **skip media:** Bump core to 0.10.4 ([fcde0f0](https://github.com/timgreen/Anki.md/commit/fcde0f033857562416c0db0e41996040ee19096d))

## [0.6.1](https://github.com/timgreen/Anki.md/compare/cli/v0.6.0...cli/v0.6.1) (2023-03-10)

### Features

- `connect getMediaFilesNames` ([56190e6](https://github.com/timgreen/Anki.md/commit/56190e64e373a1237078d70d19fad8bf97049382))
- More spinners for `sync` command ([09c212a](https://github.com/timgreen/Anki.md/commit/09c212a265b99c2a07c85318ada04d9ed5ff8cd9))

## [0.6.0](https://github.com/timgreen/Anki.md/compare/cli/v0.5.1...cli/v0.6.0) (2023-03-10)

### ⚠ BREAKING CHANGES

- default to not save the note id

### Features

- Default to not save the note id ([cbf02f6](https://github.com/timgreen/Anki.md/commit/cbf02f64589bc3c92288a3ae11e96a45776cd0a7))
- Introduce simple spinner for sync ([55c77e7](https://github.com/timgreen/Anki.md/commit/55c77e70f0accc17d891f4d888a9ecfb2d9daf8d))
- Support json output for connect wrapper ([eb74d2b](https://github.com/timgreen/Anki.md/commit/eb74d2bd948b8cf83cb5857b16c9a89951437a5c))

## [0.5.1](https://github.com/timgreen/Anki.md/compare/cli/v0.5.0...cli/v0.5.1) (2023-03-09)

### Features

- First AnkiConnect wrapper cmd `deskNames` ([5ce43d9](https://github.com/timgreen/Anki.md/commit/5ce43d92085af8c108cd66ba77ff6e86df5b3c55)), closes [#11](https://github.com/timgreen/Anki.md/issues/11)
- More wrapper commands for AnkiConnect ([d802a1f](https://github.com/timgreen/Anki.md/commit/d802a1fc5e4d98697cb5b67344b562710790b539)), closes [#11](https://github.com/timgreen/Anki.md/issues/11)

## [0.5.0](https://github.com/timgreen/Anki.md/compare/cli/v0.4.9...cli/v0.5.0) (2023-03-09)

### ⚠ BREAKING CHANGES

- Default behaviour for media sync changed to skip the existing.

### Features

- `sync` option `overwrite-existing-medias` ([ec5c7c8](https://github.com/timgreen/Anki.md/commit/ec5c7c8d0b698f461082c2abf1c417649e6d301f))

## [0.4.9](https://github.com/timgreen/Anki.md/compare/cli/v0.4.8...cli/v0.4.9) (2022-11-27)

### Features

- Support remote urls. ([69136ec](https://github.com/timgreen/Anki.md/commit/69136ecbe648631a46e30d7f28785907619d36b1))

## [0.4.8](https://github.com/timgreen/Anki.md/compare/cli/v0.4.7...cli/v0.4.8) (2022-11-26)

### Features

- Audio support [sound:a.mp3]. ([593b79b](https://github.com/timgreen/Anki.md/commit/593b79bb58aaf1ae8b89442aca23442812606aeb))
- validate frontmatter. ([593b79b](https://github.com/timgreen/Anki.md/commit/593b79bb58aaf1ae8b89442aca23442812606aeb))

## [0.4.7](https://github.com/timgreen/Anki.md/compare/cli/v0.4.6...cli/v0.4.7) (2022-11-24)

### Features

- **sync:** Flag to update model styling. ([7a9614f](https://github.com/timgreen/Anki.md/commit/7a9614f255035b4f137a49b46f7c3a57cbe618eb))

## [0.4.6](https://github.com/timgreen/Anki.md/compare/cli/v0.4.5...cli/v0.4.6) (2022-11-23)

### Features

- Command to remove note ids. ([92d51d9](https://github.com/timgreen/Anki.md/commit/92d51d9b92624460e3dd7ac5ec0c99ca2b49aa30))

## [0.4.5](https://github.com/timgreen/Anki.md/compare/cli/v0.4.4...cli/v0.4.5) (2022-11-23)

### Features

- Flag to skip save note ids. ([4449bd6](https://github.com/timgreen/Anki.md/commit/4449bd6b8172ee36676a98958eb32425bb7ee26d))
- Save noteIds after sync. ([0fe5a4d](https://github.com/timgreen/Anki.md/commit/0fe5a4d84c2e0169d58c0cecae1be36a316c4812))

## [0.4.4](https://github.com/timgreen/Anki.md/compare/cli-v0.4.3...cli/v0.4.4) (2022-11-22)

### Features

- **sync:** Cli flag to update model templates. ([2b587f7](https://github.com/timgreen/Anki.md/commit/2b587f71e180f79648d7128b53f5a2ddd4f67968))

### Bug Fixes

- Code link in generated README. ([52bbcec](https://github.com/timgreen/Anki.md/commit/52bbcecb9c6e3464bd8ed1bc93f69b5c069fab23))

## [0.4.3](https://github.com/timgreen/Anki.md/compare/@anki.md/cli-v0.4.2...@anki.md/cli@0.4.3) (2022-11-21)

### Features

- **sync:** Cli flag to update model templates. ([2b587f7](https://github.com/timgreen/Anki.md/commit/2b587f71e180f79648d7128b53f5a2ddd4f67968))

## [0.4.2](https://github.com/timgreen/Anki.md/compare/@anki.md/cli-v0.4.1...@anki.md/cli-v0.4.2) (2022-11-21)

### Bug Fixes

- code link in generated README. ([52bbcec](https://github.com/timgreen/Anki.md/commit/52bbcecb9c6e3464bd8ed1bc93f69b5c069fab23))
