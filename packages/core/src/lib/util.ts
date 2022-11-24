import { fastHashCode } from "fast-hash-code";

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
