import { fastHashCode } from "fast-hash-code";
import * as path from "path";
import { isUri } from "valid-url";

import { MediaInfo, MediaName } from "../model";

import type { Alternative, Resource } from "mdast";
/**
 * According to https://docs.ankiweb.net/importing.html#importing-media
 * Do not put subdirectories in the media folder, or some features will not work.
 *
 * Use normalized filename instead to avoid collisions when flattening all the media files.
 */
export function normalizedFilename(resource: Resource & Alternative): string {
  const hash = fastHashCode(
    JSON.stringify({
      url: resource.url,
      alt: resource.alt,
      title: resource.title,
    }),
    {
      forcePositive: true,
    },
  );
  return `${hash}-${resource.url.split("/").at(-1)}`;
}

export function normalize(
  resource: Resource & Alternative,
  dirpath?: string,
): [MediaName, MediaInfo] {
  if (isUri(resource.url)) {
    const filename = normalizedFilename(resource);
    return [filename, { url: resource.url }];
  } else {
    const absPath = path.resolve(dirpath || path.resolve(), resource.url);
    const filename = normalizedFilename({
      ...resource,
      url: path.relative(dirpath || path.resolve(), absPath),
    });
    return [filename, { absPath }];
  }
}
