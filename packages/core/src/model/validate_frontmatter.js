"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {
  $ref: "#/definitions/IFrontmatterConfig",
  $schema: "http://json-schema.org/draft-07/schema#",
  definitions: {
    FieldName: { type: "string" },
    IFrontmatterConfig: {
      additionalProperties: false,
      properties: {
        deckName: {
          default: "Default",
          description: "The container deck for the notes in the file.",
          examples: ["deckA", "a::b::c"],
          type: "string",
        },
        models: {
          additionalProperties: { $ref: "#/definitions/NoteModel" },
          description: "Define the custom NoteModel for the notes in the file.",
          propertyNames: {
            description:
              'The name of the note model.\n\nOverride the following default NoteModels are not allowed:\n- "Basic"\n- "Basic (and reversed card)"\n- "Basic (optional reversed card)"\n- "Basic (type in the answer)"\n- "Cloze"',
            pattern:
              "^(?!(Basic|Basic \\(and reversed card\\)|Basic \\(optional reversed card\\)|Basic \\(type in the answer\\)|Cloze)$)\\w.*",
          },
          type: "object",
        },
        tags: {
          description: "Global tags for the notes in the deck.",
          examples: ["global-tag-1"],
          items: { type: "string" },
          type: "array",
        },
      },
      type: "object",
    },
    ModelTemplates: {
      additionalProperties: {
        additionalProperties: false,
        properties: { Back: { type: "string" }, Front: { type: "string" } },
        required: ["Front", "Back"],
        type: "object",
      },
      type: "object",
    },
    NoteModel: {
      additionalProperties: false,
      description: "Represents a note model.",
      properties: {
        css: { description: "Note model styling.", type: "string" },
        highlight: {
          description:
            'Whether enable the code syntax highlight or not.\n\n- null or "" means don\'t enable code syntax highlighting.\n- "dark" means use the default dark css.\n- other string value will be treated as file path or url pointing to a css.',
          examples: [
            "dark",
            "light",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/github-dark.min.css",
          ],
          type: "string",
        },
        inOrderFields: {
          description: "Ordered field names.",
          items: { $ref: "#/definitions/FieldName" },
          minItems: 1,
          type: "array",
        },
        templates: {
          $ref: "#/definitions/ModelTemplates",
          description: "Card templates for the note model.",
        },
      },
      required: ["inOrderFields", "templates"],
      type: "object",
    },
  },
};
const schema23 = {
  additionalProperties: false,
  properties: {
    deckName: {
      default: "Default",
      description: "The container deck for the notes in the file.",
      examples: ["deckA", "a::b::c"],
      type: "string",
    },
    models: {
      additionalProperties: { $ref: "#/definitions/NoteModel" },
      description: "Define the custom NoteModel for the notes in the file.",
      propertyNames: {
        description:
          'The name of the note model.\n\nOverride the following default NoteModels are not allowed:\n- "Basic"\n- "Basic (and reversed card)"\n- "Basic (optional reversed card)"\n- "Basic (type in the answer)"\n- "Cloze"',
        pattern:
          "^(?!(Basic|Basic \\(and reversed card\\)|Basic \\(optional reversed card\\)|Basic \\(type in the answer\\)|Cloze)$)\\w.*",
      },
      type: "object",
    },
    tags: {
      description: "Global tags for the notes in the deck.",
      examples: ["global-tag-1"],
      items: { type: "string" },
      type: "array",
    },
  },
  type: "object",
};
const pattern0 = new RegExp(
  "^(?!(Basic|Basic \\(and reversed card\\)|Basic \\(optional reversed card\\)|Basic \\(type in the answer\\)|Cloze)$)\\w.*",
  "u",
);
const schema24 = {
  additionalProperties: false,
  description: "Represents a note model.",
  properties: {
    css: { description: "Note model styling.", type: "string" },
    highlight: {
      description:
        'Whether enable the code syntax highlight or not.\n\n- null or "" means don\'t enable code syntax highlighting.\n- "dark" means use the default dark css.\n- other string value will be treated as file path or url pointing to a css.',
      examples: [
        "dark",
        "light",
        "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/github-dark.min.css",
      ],
      type: "string",
    },
    inOrderFields: {
      description: "Ordered field names.",
      items: { $ref: "#/definitions/FieldName" },
      minItems: 1,
      type: "array",
    },
    templates: {
      $ref: "#/definitions/ModelTemplates",
      description: "Card templates for the note model.",
    },
  },
  required: ["inOrderFields", "templates"],
  type: "object",
};
const schema25 = { type: "string" };
const schema26 = {
  additionalProperties: {
    additionalProperties: false,
    properties: { Back: { type: "string" }, Front: { type: "string" } },
    required: ["Front", "Back"],
    type: "object",
  },
  type: "object",
};
function validate22(
  data,
  { instancePath = "", parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      let missing0;
      if (
        (data.inOrderFields === undefined && (missing0 = "inOrderFields")) ||
        (data.templates === undefined && (missing0 = "templates"))
      ) {
        validate22.errors = [
          {
            instancePath,
            schemaPath: "#/required",
            keyword: "required",
            params: { missingProperty: missing0 },
            message: "must have required property '" + missing0 + "'",
          },
        ];
        return false;
      } else {
        const _errs1 = errors;
        for (const key0 in data) {
          if (
            !(
              key0 === "css" ||
              key0 === "highlight" ||
              key0 === "inOrderFields" ||
              key0 === "templates"
            )
          ) {
            validate22.errors = [
              {
                instancePath,
                schemaPath: "#/additionalProperties",
                keyword: "additionalProperties",
                params: { additionalProperty: key0 },
                message: "must NOT have additional properties",
              },
            ];
            return false;
            break;
          }
        }
        if (_errs1 === errors) {
          if (data.css !== undefined) {
            const _errs2 = errors;
            if (typeof data.css !== "string") {
              validate22.errors = [
                {
                  instancePath: instancePath + "/css",
                  schemaPath: "#/properties/css/type",
                  keyword: "type",
                  params: { type: "string" },
                  message: "must be string",
                },
              ];
              return false;
            }
            var valid0 = _errs2 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.highlight !== undefined) {
              const _errs4 = errors;
              if (typeof data.highlight !== "string") {
                validate22.errors = [
                  {
                    instancePath: instancePath + "/highlight",
                    schemaPath: "#/properties/highlight/type",
                    keyword: "type",
                    params: { type: "string" },
                    message: "must be string",
                  },
                ];
                return false;
              }
              var valid0 = _errs4 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.inOrderFields !== undefined) {
                let data2 = data.inOrderFields;
                const _errs6 = errors;
                if (errors === _errs6) {
                  if (Array.isArray(data2)) {
                    if (data2.length < 1) {
                      validate22.errors = [
                        {
                          instancePath: instancePath + "/inOrderFields",
                          schemaPath: "#/properties/inOrderFields/minItems",
                          keyword: "minItems",
                          params: { limit: 1 },
                          message: "must NOT have fewer than 1 items",
                        },
                      ];
                      return false;
                    } else {
                      var valid1 = true;
                      const len0 = data2.length;
                      for (let i0 = 0; i0 < len0; i0++) {
                        const _errs8 = errors;
                        if (typeof data2[i0] !== "string") {
                          validate22.errors = [
                            {
                              instancePath:
                                instancePath + "/inOrderFields/" + i0,
                              schemaPath: "#/definitions/FieldName/type",
                              keyword: "type",
                              params: { type: "string" },
                              message: "must be string",
                            },
                          ];
                          return false;
                        }
                        var valid1 = _errs8 === errors;
                        if (!valid1) {
                          break;
                        }
                      }
                    }
                  } else {
                    validate22.errors = [
                      {
                        instancePath: instancePath + "/inOrderFields",
                        schemaPath: "#/properties/inOrderFields/type",
                        keyword: "type",
                        params: { type: "array" },
                        message: "must be array",
                      },
                    ];
                    return false;
                  }
                }
                var valid0 = _errs6 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.templates !== undefined) {
                  let data4 = data.templates;
                  const _errs11 = errors;
                  const _errs12 = errors;
                  if (errors === _errs12) {
                    if (
                      data4 &&
                      typeof data4 == "object" &&
                      !Array.isArray(data4)
                    ) {
                      for (const key1 in data4) {
                        let data5 = data4[key1];
                        const _errs15 = errors;
                        if (errors === _errs15) {
                          if (
                            data5 &&
                            typeof data5 == "object" &&
                            !Array.isArray(data5)
                          ) {
                            let missing1;
                            if (
                              (data5.Front === undefined &&
                                (missing1 = "Front")) ||
                              (data5.Back === undefined && (missing1 = "Back"))
                            ) {
                              validate22.errors = [
                                {
                                  instancePath:
                                    instancePath +
                                    "/templates/" +
                                    key1
                                      .replace(/~/g, "~0")
                                      .replace(/\//g, "~1"),
                                  schemaPath:
                                    "#/definitions/ModelTemplates/additionalProperties/required",
                                  keyword: "required",
                                  params: { missingProperty: missing1 },
                                  message:
                                    "must have required property '" +
                                    missing1 +
                                    "'",
                                },
                              ];
                              return false;
                            } else {
                              const _errs17 = errors;
                              for (const key2 in data5) {
                                if (!(key2 === "Back" || key2 === "Front")) {
                                  validate22.errors = [
                                    {
                                      instancePath:
                                        instancePath +
                                        "/templates/" +
                                        key1
                                          .replace(/~/g, "~0")
                                          .replace(/\//g, "~1"),
                                      schemaPath:
                                        "#/definitions/ModelTemplates/additionalProperties/additionalProperties",
                                      keyword: "additionalProperties",
                                      params: { additionalProperty: key2 },
                                      message:
                                        "must NOT have additional properties",
                                    },
                                  ];
                                  return false;
                                  break;
                                }
                              }
                              if (_errs17 === errors) {
                                if (data5.Back !== undefined) {
                                  const _errs18 = errors;
                                  if (typeof data5.Back !== "string") {
                                    validate22.errors = [
                                      {
                                        instancePath:
                                          instancePath +
                                          "/templates/" +
                                          key1
                                            .replace(/~/g, "~0")
                                            .replace(/\//g, "~1") +
                                          "/Back",
                                        schemaPath:
                                          "#/definitions/ModelTemplates/additionalProperties/properties/Back/type",
                                        keyword: "type",
                                        params: { type: "string" },
                                        message: "must be string",
                                      },
                                    ];
                                    return false;
                                  }
                                  var valid5 = _errs18 === errors;
                                } else {
                                  var valid5 = true;
                                }
                                if (valid5) {
                                  if (data5.Front !== undefined) {
                                    const _errs20 = errors;
                                    if (typeof data5.Front !== "string") {
                                      validate22.errors = [
                                        {
                                          instancePath:
                                            instancePath +
                                            "/templates/" +
                                            key1
                                              .replace(/~/g, "~0")
                                              .replace(/\//g, "~1") +
                                            "/Front",
                                          schemaPath:
                                            "#/definitions/ModelTemplates/additionalProperties/properties/Front/type",
                                          keyword: "type",
                                          params: { type: "string" },
                                          message: "must be string",
                                        },
                                      ];
                                      return false;
                                    }
                                    var valid5 = _errs20 === errors;
                                  } else {
                                    var valid5 = true;
                                  }
                                }
                              }
                            }
                          } else {
                            validate22.errors = [
                              {
                                instancePath:
                                  instancePath +
                                  "/templates/" +
                                  key1.replace(/~/g, "~0").replace(/\//g, "~1"),
                                schemaPath:
                                  "#/definitions/ModelTemplates/additionalProperties/type",
                                keyword: "type",
                                params: { type: "object" },
                                message: "must be object",
                              },
                            ];
                            return false;
                          }
                        }
                        var valid4 = _errs15 === errors;
                        if (!valid4) {
                          break;
                        }
                      }
                    } else {
                      validate22.errors = [
                        {
                          instancePath: instancePath + "/templates",
                          schemaPath: "#/definitions/ModelTemplates/type",
                          keyword: "type",
                          params: { type: "object" },
                          message: "must be object",
                        },
                      ];
                      return false;
                    }
                  }
                  var valid0 = _errs11 === errors;
                } else {
                  var valid0 = true;
                }
              }
            }
          }
        }
      }
    } else {
      validate22.errors = [
        {
          instancePath,
          schemaPath: "#/type",
          keyword: "type",
          params: { type: "object" },
          message: "must be object",
        },
      ];
      return false;
    }
  }
  validate22.errors = vErrors;
  return errors === 0;
}
function validate21(
  data,
  { instancePath = "", parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      const _errs1 = errors;
      for (const key0 in data) {
        if (!(key0 === "deckName" || key0 === "models" || key0 === "tags")) {
          validate21.errors = [
            {
              instancePath,
              schemaPath: "#/additionalProperties",
              keyword: "additionalProperties",
              params: { additionalProperty: key0 },
              message: "must NOT have additional properties",
            },
          ];
          return false;
          break;
        }
      }
      if (_errs1 === errors) {
        if (data.deckName !== undefined) {
          const _errs2 = errors;
          if (typeof data.deckName !== "string") {
            validate21.errors = [
              {
                instancePath: instancePath + "/deckName",
                schemaPath: "#/properties/deckName/type",
                keyword: "type",
                params: { type: "string" },
                message: "must be string",
              },
            ];
            return false;
          }
          var valid0 = _errs2 === errors;
        } else {
          var valid0 = true;
        }
        if (valid0) {
          if (data.models !== undefined) {
            let data1 = data.models;
            const _errs4 = errors;
            if (errors === _errs4) {
              if (data1 && typeof data1 == "object" && !Array.isArray(data1)) {
                for (const key1 in data1) {
                  const _errs6 = errors;
                  if (typeof key1 === "string") {
                    if (!pattern0.test(key1)) {
                      const err0 = {
                        instancePath: instancePath + "/models",
                        schemaPath: "#/properties/models/propertyNames/pattern",
                        keyword: "pattern",
                        params: {
                          pattern:
                            "^(?!(Basic|Basic \\(and reversed card\\)|Basic \\(optional reversed card\\)|Basic \\(type in the answer\\)|Cloze)$)\\w.*",
                        },
                        message:
                          'must match pattern "' +
                          "^(?!(Basic|Basic \\(and reversed card\\)|Basic \\(optional reversed card\\)|Basic \\(type in the answer\\)|Cloze)$)\\w.*" +
                          '"',
                        propertyName: key1,
                      };
                      if (vErrors === null) {
                        vErrors = [err0];
                      } else {
                        vErrors.push(err0);
                      }
                      errors++;
                    }
                  }
                  var valid1 = _errs6 === errors;
                  if (!valid1) {
                    const err1 = {
                      instancePath: instancePath + "/models",
                      schemaPath: "#/properties/models/propertyNames",
                      keyword: "propertyNames",
                      params: { propertyName: key1 },
                      message: "property name must be valid",
                    };
                    if (vErrors === null) {
                      vErrors = [err1];
                    } else {
                      vErrors.push(err1);
                    }
                    errors++;
                    validate21.errors = vErrors;
                    return false;
                    break;
                  }
                }
                if (valid1) {
                  for (const key2 in data1) {
                    const _errs8 = errors;
                    if (
                      !validate22(data1[key2], {
                        instancePath:
                          instancePath +
                          "/models/" +
                          key2.replace(/~/g, "~0").replace(/\//g, "~1"),
                        parentData: data1,
                        parentDataProperty: key2,
                        rootData,
                      })
                    ) {
                      vErrors =
                        vErrors === null
                          ? validate22.errors
                          : vErrors.concat(validate22.errors);
                      errors = vErrors.length;
                    }
                    var valid2 = _errs8 === errors;
                    if (!valid2) {
                      break;
                    }
                  }
                }
              } else {
                validate21.errors = [
                  {
                    instancePath: instancePath + "/models",
                    schemaPath: "#/properties/models/type",
                    keyword: "type",
                    params: { type: "object" },
                    message: "must be object",
                  },
                ];
                return false;
              }
            }
            var valid0 = _errs4 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.tags !== undefined) {
              let data3 = data.tags;
              const _errs9 = errors;
              if (errors === _errs9) {
                if (Array.isArray(data3)) {
                  var valid3 = true;
                  const len0 = data3.length;
                  for (let i0 = 0; i0 < len0; i0++) {
                    const _errs11 = errors;
                    if (typeof data3[i0] !== "string") {
                      validate21.errors = [
                        {
                          instancePath: instancePath + "/tags/" + i0,
                          schemaPath: "#/properties/tags/items/type",
                          keyword: "type",
                          params: { type: "string" },
                          message: "must be string",
                        },
                      ];
                      return false;
                    }
                    var valid3 = _errs11 === errors;
                    if (!valid3) {
                      break;
                    }
                  }
                } else {
                  validate21.errors = [
                    {
                      instancePath: instancePath + "/tags",
                      schemaPath: "#/properties/tags/type",
                      keyword: "type",
                      params: { type: "array" },
                      message: "must be array",
                    },
                  ];
                  return false;
                }
              }
              var valid0 = _errs9 === errors;
            } else {
              var valid0 = true;
            }
          }
        }
      }
    } else {
      validate21.errors = [
        {
          instancePath,
          schemaPath: "#/type",
          keyword: "type",
          params: { type: "object" },
          message: "must be object",
        },
      ];
      return false;
    }
  }
  validate21.errors = vErrors;
  return errors === 0;
}
function validate20(
  data,
  { instancePath = "", parentData, parentDataProperty, rootData = data } = {},
) {
  let vErrors = null;
  let errors = 0;
  if (
    !validate21(data, {
      instancePath,
      parentData,
      parentDataProperty,
      rootData,
    })
  ) {
    vErrors =
      vErrors === null ? validate21.errors : vErrors.concat(validate21.errors);
    errors = vErrors.length;
  }
  validate20.errors = vErrors;
  return errors === 0;
}
