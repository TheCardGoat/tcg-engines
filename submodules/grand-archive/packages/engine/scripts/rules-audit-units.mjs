import { createHash } from "node:crypto";

function withoutImages(value) {
  return value.replace(/!\[[^\]]*\]\([^\n]*?\)/g, "").replace(/<img\b[^>]*>/g, "");
}

function titleText(value) {
  return withoutImages(value)
    .replace(/<a\b[^>]*>.*?<\/a>/g, "")
    .replace(/[`*_]/g, "")
    .trim();
}

/** Image-only headings belong to the preceding named section, not to a CDN URL. */
export function ruleUnits(file, source) {
  const headings = [...source.matchAll(/^(#{1,6})\s+(.+?)\s*$/gm)].filter(
    (heading) => titleText(heading[2]).length > 0,
  );
  const units = [];
  for (const [index, heading] of headings.entries()) {
    const body = source.slice(
      heading.index + heading[0].length,
      headings[index + 1]?.index ?? source.length,
    );
    if (!/^\s*(?:\d+\.|\*)\s+/m.test(body)) continue;
    const title = titleText(heading[2]);
    const text = withoutImages(body)
      .replace(/^#+\s*$/gm, "")
      .replace(/\r\n/g, "\n")
      .trim();
    units.push({
      key: `${file}#${title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}`,
      file,
      title,
      line: source.slice(0, heading.index).split("\n").length,
      fingerprint: createHash("sha256").update(`${title}\n${text}`).digest("hex"),
    });
  }
  return units;
}
