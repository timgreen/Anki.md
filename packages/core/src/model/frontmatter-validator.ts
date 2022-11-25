import Ajv from "ajv";

import { IFrontmatterConfig } from "./frontmatter";
import schema from "./frontmatter.json";

const ajv = new Ajv({
  allowUnionTypes: true,
});

export const validate = ajv.compile<IFrontmatterConfig>(schema);
