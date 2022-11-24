import { Root } from "mdast";
import { Extension as FromMarkdownExtension } from "mdast-util-from-markdown";
import { codes } from "micromark-util-symbol/codes";
import { markdownLineEnding } from "micromark-util-character";
import {
  Code,
  Construct,
  Extension,
  HtmlExtension,
  Previous,
  State,
  Tokenizer,
} from "micromark-util-types";
import { Plugin } from "unified";
import { Node } from "unist";

const types = {
  ankiSound: "ankiSound",
  ankiSoundOpen: "ankiSoundOpen",
  ankiSoundTag: "ankiSoundTag",
  ankiSoundRes: "ankiSoundRes",
  ankiSoundClose: "ankiSoundClose",
};

// "sound:"
const prefix = [
  codes.lowercaseS,
  codes.lowercaseO,
  codes.lowercaseU,
  codes.lowercaseN,
  codes.lowercaseD,
  codes.colon,
];

/** Syntax extension (text -> tokens) */
export function ankiSound(): Extension {
  const tokenize: Tokenizer = (effects, ok, nok) => {
    let prefixI: number = 0;

    return enter;

    function enter(code: Code): State | void {
      if (code === codes.leftSquareBracket) {
        effects.enter(types.ankiSound);
        effects.enter(types.ankiSoundOpen);
        effects.consume(code);
        effects.exit(types.ankiSoundOpen);
        return soundPrefix;
      } else {
        return nok(code);
      }
    }

    function soundPrefix(code: Code): State | void {
      if (prefixI < prefix.length && code === prefix[prefixI]) {
        if (prefixI === 0) {
          effects.enter(types.ankiSoundTag);
        }
        effects.consume(code);
        prefixI++;
        return soundPrefix;
      } else if (prefixI === prefix.length) {
        effects.exit(types.ankiSoundTag);
        return resource;
      } else {
        return nok(code);
      }
    }

    function resource(code: Code): State | void {
      if (isAlphaChar(code)) {
        effects.enter(types.ankiSoundRes);
        effects.consume(code);
        return continueResource;
      } else {
        return nok(code);
      }
    }

    function continueResource(code: Code): State | void {
      if (code === codes.rightSquareBracket) {
        effects.exit(types.ankiSoundRes);
        effects.enter(types.ankiSoundClose);
        effects.consume(code);
        effects.exit(types.ankiSoundClose);
        effects.exit(types.ankiSound);
        return ok(code);
      } else if (markdownLineEnding(code) || code === codes.eof) {
        return nok(code);
      } else {
        effects.consume(code);
        return continueResource;
      }
    }
  };

  const previous: Previous = (code) => {
    return true;
  };

  const construct: Construct = {
    name: "ankiSound",
    tokenize,
    previous,
  };

  return {
    text: {
      [codes.leftSquareBracket]: construct,
    },
  };
}

/** Returns true if character is in the English alphabet */
function isAlphaChar(code: Code): boolean {
  if (code === null) return false;
  return (
    (code >= codes.lowercaseA && code <= codes.lowercaseZ) ||
    (code >= codes.uppercaseA && code <= codes.uppercaseZ)
  );
}

/**
 * HTML extension (tokens -> HTML)
 * This is only used for unit testing
 */
export function ankiSoundHtml(): HtmlExtension {
  return {
    enter: {
      [types.ankiSoundRes](token) {
        const res = this.sliceSerialize(token);
        this.tag(`<anki-sound resource="${res}" />`);
      },
    },
  };
}

// Register ankiSound as an mdast node type
export interface AnkiSound extends Node {
  type: "ankiSound";
  url: string;
}

declare module "mdast" {
  interface StaticPhrasingContentMap {
    ankiSound: AnkiSound;
  }
}

/** MDAST extension (tokens -> MDAST) */
export function ankiSoundFromMarkdown(): FromMarkdownExtension {
  // Initialize state
  let resource: string | undefined;

  return {
    enter: {
      [types.ankiSound](token) {
        this.enter({ type: "ankiSound", url: "" }, token);
      },
      [types.ankiSoundRes](token) {
        resource = this.sliceSerialize(token);
      },
    },
    exit: {
      [types.ankiSound](token) {
        const node = this.stack[this.stack.length - 1];

        if (node.type === "ankiSound") {
          node.url = resource || "";
        }

        this.exit(token);

        // Reset state
        resource = undefined;
      },
    },
  };
}

/**
 * Remark plugin
 * Reference: https://github.com/remarkjs/remark-gfm/blob/main/index.js
 */
export function remarkAnkiSound(): ReturnType<Plugin<[], Root>> {
  // @ts-ignore I'm not sure how to type `this`
  const data = this.data();

  add("micromarkExtensions", ankiSound());
  add("fromMarkdownExtensions", ankiSoundFromMarkdown());

  function add(field: string, value: unknown) {
    const list = data[field] ? data[field] : (data[field] = []);
    list.push(value);
  }
}
