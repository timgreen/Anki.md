import { ErrorObject } from "ajv";

import { IFrontmatterConfig } from "./frontmatter";
import validateConfig from "./validate_frontmatter.cjs";

export class FrontmatterConfigError extends Error {
  constructor(public errors: ErrorObject[]) {
    super(JSON.stringify(errors));
  }
}

export function validate(data: any): data is IFrontmatterConfig | never {
  const result = validateConfig(data);
  if (result) {
    return result;
  } else {
    throw new FrontmatterConfigError(validateConfig.errors!!);
  }
}
