import { createHash } from "node:crypto";

let body = "";
process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) body += chunk;

const normalized = ["type", "feature"]
  .map((id) => {
    const match = body.match(new RegExp(`<section[^>]*id="${id}"[^>]*>([\\s\\S]*?)<\\/section>`));
    if (!match) throw new Error(`Official rules source is missing #${id}`);
    return `${id}:${match[1]
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&rsquo;|&#8217;|&#x2019;/g, "’")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim()}`;
  })
  .join("\n");

process.stdout.write(`${createHash("sha256").update(normalized).digest("hex")}\n`);
