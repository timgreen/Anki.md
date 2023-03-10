# Changelog

## [0.10.4](https://github.com/timgreen/Anki.md/compare/core/v0.10.3...core/v0.10.4) (2023-03-10)


### Bug Fixes

* Correctly skip the existing medias ([983f700](https://github.com/timgreen/Anki.md/commit/983f700a9c962d6bd6f922c4fc167baa4fadee89))

## [0.10.3](https://github.com/timgreen/Anki.md/compare/core/v0.10.2...core/v0.10.3) (2023-03-10)

### Features

- Report details during the sync ([33b9446](https://github.com/timgreen/Anki.md/commit/33b9446c514401629abf878e68d72d76aa0baa91))

## [0.10.2](https://github.com/timgreen/Anki.md/compare/core/v0.10.1...core/v0.10.2) (2023-03-09)

### Features

- Option to skip existing medias ([ddc90e4](https://github.com/timgreen/Anki.md/commit/ddc90e4aac28b0e4e99105d8f3ea3c78c6bbf031))

## [0.10.1](https://github.com/timgreen/Anki.md/compare/core/v0.10.0...core/v0.10.1) (2022-11-27)

### Features

- Support remote url. ([479e9af](https://github.com/timgreen/Anki.md/commit/479e9af4ed5e7a2dd94d4e9703bf764a39ff78a2))

## [0.10.0](https://github.com/timgreen/Anki.md/compare/core/v0.9.0...core/v0.10.0) (2022-11-26)

### ⚠ BREAKING CHANGES

- Use only string for `highlight`.

### Features

- Not allow overriding default models. ([2b1a799](https://github.com/timgreen/Anki.md/commit/2b1a799fb9a822a53bd8f32ff096e81e97d8645c)), closes [#41](https://github.com/timgreen/Anki.md/issues/41)

### Code Refactoring

- Use only string for `highlight`. ([1e3f484](https://github.com/timgreen/Anki.md/commit/1e3f48410d1c757b7f4dec60f0fdb97d6c163327))

## [0.9.0](https://github.com/timgreen/Anki.md/compare/core/v0.8.2...core/v0.9.0) (2022-11-25)

### ⚠ BREAKING CHANGES

- **model:** export models as model.\* now.

### Features

- **parser:** Exit on invalid frontmatter. ([4f873dc](https://github.com/timgreen/Anki.md/commit/4f873dcfbf02e26e3560c8101d6af5810ce95fc9))

### Code Refactoring

- **model:** Split into files. ([3c8e82c](https://github.com/timgreen/Anki.md/commit/3c8e82ce24c91260e0cdd21e1e09effd3dcf77d0))

## [0.8.2](https://github.com/timgreen/Anki.md/compare/core/v0.8.1...core/v0.8.2) (2022-11-24)

### Features

- Audio support `[sound:a.mp3]`. ([55333ba](https://github.com/timgreen/Anki.md/commit/55333ba038ac9235f5b9cd2a885d5be72bdcfbff))

## [0.8.1](https://github.com/timgreen/Anki.md/compare/core/v0.8.0...core/v0.8.1) (2022-11-23)

### Bug Fixes

- Code syntax highlight css injection. ([3f94b8a](https://github.com/timgreen/Anki.md/commit/3f94b8a4777fac44968d61b14bdf0ea0b3587abd))

## [0.8.0](https://github.com/timgreen/Anki.md/compare/core/v0.7.5...core/v0.8.0) (2022-11-23)

### ⚠ BREAKING CHANGES

- **NoteId:** Type string? -> number?.

### Features

- **AnkiConnect:** Update the existing notes. ([9b6108e](https://github.com/timgreen/Anki.md/commit/9b6108e02d9a1c3b4149e6c17fc0085725c686aa))

### Code Refactoring

- **NoteId:** Type string? -&gt; number?. ([db3c5db](https://github.com/timgreen/Anki.md/commit/db3c5db2b81fd9f99d3f822797eacdf9294582d2))

## [0.7.5](https://github.com/timgreen/Anki.md/compare/core/v0.7.4...core/v0.7.5) (2022-11-22)

### Features

- **parser:** Include highlight css when needed. ([8e51b92](https://github.com/timgreen/Anki.md/commit/8e51b92872a5e2cb88b12afa8b443d113de804ef))

## [0.7.4](https://github.com/timgreen/Anki.md/compare/core/v0.7.3...core/v0.7.4) (2022-11-22)

### Features

- **parser:** Code syntax highlight, no css. ([ca9d5ef](https://github.com/timgreen/Anki.md/commit/ca9d5ef374591c29969b1cbf1e092621584efc15))

## [0.7.3](https://github.com/timgreen/Anki.md/compare/core/v0.7.2...core/v0.7.3) (2022-11-22)

### Features

- **AnkiConnect:** Option to update model styling. ([6cb5410](https://github.com/timgreen/Anki.md/commit/6cb54107446931b487d9b34e57f9311511c90f3c))

## [0.7.2](https://github.com/timgreen/Anki.md/compare/core/v0.7.1...core/v0.7.2) (2022-11-22)

### Features

- **parser:** Support global tags in frontmatter. ([5d7e0a0](https://github.com/timgreen/Anki.md/commit/5d7e0a0db279a787efaff1154daf522b56a2fb07))

## [0.7.1](https://github.com/timgreen/Anki.md/compare/core/v0.7.0...core/v0.7.1) (2022-11-22)

### Features

- **AnkiConnect:** Pass api origin via config. ([13f0ff5](https://github.com/timgreen/Anki.md/commit/13f0ff567d6f96d397fb5c1aaee7c22a252d2165)), closes [#14](https://github.com/timgreen/Anki.md/issues/14)

## [0.7.0](https://github.com/timgreen/Anki.md/compare/core-v0.6.0...core/v0.7.0) (2022-11-22)

### ⚠ BREAKING CHANGES

- **NoteId:** Move noteId to the heading.
- **core:** Update frontmatter model schema.

### Features

- **core:** Update frontmatter model schema. ([ed04257](https://github.com/timgreen/Anki.md/commit/ed04257f27a1feb8d88c43184399c75a5a8423a7))
- **NoteId:** Helper to update noteId. ([bfc6bb6](https://github.com/timgreen/Anki.md/commit/bfc6bb625975bb947b334ec6a317d7401e5c756f))
- **NoteId:** Parser returns note position. ([8a4e36d](https://github.com/timgreen/Anki.md/commit/8a4e36dd45aa994de224e876d464e5d68e5f79f6))

### Code Refactoring

- **NoteId:** Move noteId to the heading. ([d47eb29](https://github.com/timgreen/Anki.md/commit/d47eb29046d60ba366be282be2678c7deb6eb03c))

## [0.6.0](https://github.com/timgreen/Anki.md/compare/@anki.md/core-v0.5.0...@anki.md/core-v0.6.0) (2022-11-21)

### ⚠ BREAKING CHANGES

- **core:** update frontmatter model schema.

### Features

- **core:** update frontmatter model schema. ([ed04257](https://github.com/timgreen/Anki.md/commit/ed04257f27a1feb8d88c43184399c75a5a8423a7))
