// Repair printings metadata in the One Piece cards package against the
// optcgapi ground-truth snapshot (fetched by optcgapi-snapshot.mjs).
//
//   node --experimental-strip-types scripts/repair-printings.mjs            # dry run, writes report
//   node --experimental-strip-types scripts/repair-printings.mjs --apply    # rewrite card files
//
// Ground-truth model (optcgapi): `card_image_id` is the physical print id,
// `card_set_id` is the printed card number ("OP05-001"), and `set_id` is the
// distributing product ("EB-02"). Reprints keep their original printed
// numbers; parallel prints share them. Starter-deck (ST*) and DON cards are
// not covered by the API; their printed number is their canonical number.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CARDS_SRC = join(__dirname, "..", "src", "cards");
const SNAPSHOT_DIR = process.env.OP_API_SNAPSHOT_DIR ?? "/tmp/op-api-snapshot";
const APPLY = process.argv.includes("--apply");

// ---------- load optcgapi snapshot ----------
const apiByImageId = new Map(); // image id -> entries[] (ids are reused across products)
const apiByNumber = new Map();
let apiDuplicateImageIds = 0;
for (const file of readdirSync(SNAPSHOT_DIR)) {
  if (!file.endsWith(".json")) continue;
  const productSet = file.replace(/\.json$/, "");
  for (const entry of JSON.parse(readFileSync(join(SNAPSHOT_DIR, file), "utf8"))) {
    if (!entry.card_image_id || !entry.card_set_id) continue;
    if (!apiByImageId.has(entry.card_image_id)) apiByImageId.set(entry.card_image_id, []);
    if (apiByImageId.get(entry.card_image_id).length > 0) apiDuplicateImageIds++;
    apiByImageId.get(entry.card_image_id).push({ ...entry, productSet });
    if (!apiByNumber.has(entry.card_set_id)) apiByNumber.set(entry.card_set_id, []);
    apiByNumber.get(entry.card_set_id).push({ ...entry, productSet });
  }
}
function selectApiEntry(card, printingId) {
  const entries = apiByImageId.get(printingId);
  if (!entries) return null;
  const inProduct = entries.filter(
    (entry) => normalizeProductSet(entry.productSet) === normalizeProductSet(card.setId),
  );
  if (inProduct.length === 1) return inProduct[0];
  if (entries.length === 1) return entries[0];
  return null;
}

// ---------- load catalog ----------
const { allCards } = await import(join(__dirname, "..", "src", "index.ts"));
const cardById = new Map(allCards.map((card) => [card.id, card]));

// ---------- map def ids to source files ----------
function listCardFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listCardFiles(path);
    if (!entry.name.endsWith(".ts") || entry.name.endsWith(".i18n.ts") || entry.name === "index.ts")
      return [];
    return [path];
  });
}
const fileForDefId = new Map();
const multiDefFiles = [];
for (const path of listCardFiles(CARDS_SRC)) {
  const text = readFileSync(path, "utf8");
  // def ids sit at 2-space indent; printing ids inside `printings: [` at 6
  const ids = [...text.matchAll(/^ {2}id: "([^"]+)",$/gm)].map((m) => m[1]);
  if (ids.length > 1) {
    multiDefFiles.push(path);
    continue;
  }
  if (ids.length === 1) fileForDefId.set(ids[0], path);
}

// ---------- helpers ----------
const NUMBER_RE = /^([A-Z]+\d*)-(.+)$/;
function splitNumber(number) {
  const m = NUMBER_RE.exec(number);
  return m ? { setCode: m[1], collectorNumber: m[2] } : null;
}
function normalizeProductSet(productSet) {
  return productSet.replaceAll("-", "");
}
function variantSuffix(id) {
  const m = /^(?:[A-Z]+\d+)-[0-9A-Za-z]*_(.+)$/.exec(id);
  return m ? m[1] : null;
}
function isKnownVariantSuffix(suffix) {
  return /^p\d+$/.test(suffix) || /^sp\d+$/.test(suffix) || /^r\d+$/.test(suffix);
}
const NAME_SUFFIX_VOCAB =
  /\s+\((?:Reprint|Pirate Foil|SP|Jolly Roger Foil|Parallel|Alternate Art|Alt Art|SPR|Manga Rare|Wanted Poster|Full Art|Silver|Gold|[A-Z0-9]+-[0-9]+(?:_p\d+)?|\d{3})\)$/i;
function desuffixName(name) {
  let out = name;
  for (;;) {
    const idRef = /\s+-\s+[A-Z0-9]+-[0-9]+.*$/.exec(out);
    if (idRef) {
      out = out.slice(0, idRef.index);
      continue;
    }
    const paren = NAME_SUFFIX_VOCAB.exec(out);
    if (paren) {
      out = out.slice(0, paren.index);
      continue;
    }
    return out;
  }
}

// ---------- compute corrections ----------
const results = []; // { card, printings, changes[], rename?, setId? }
const unresolved = [];
const anomalies = [];
const claimedImageIds = new Set();
const existingPrintIds = new Set(allCards.flatMap((card) => card.printings.map((p) => p.id)));

for (const card of allCards) {
  const changes = [];
  const corrected = [];
  const seenIds = new Set();

  for (const printing of card.printings) {
    if (seenIds.has(printing.id)) {
      changes.push(`drop duplicate printing entry ${printing.id}`);
      continue;
    }
    seenIds.add(printing.id);
    const next = { ...printing };
    const notes = [];

    // The printed card number (rules 2-14 / 5-1-2-3) is the canonical card's
    // number for every print of that card — reprints keep it, parallels share
    // it. The API is used only for art identity (imageUrl) and display label;
    // its image ids are reused across products with conflicting numbers, so
    // they never drive the number.
    const canonicalParts = splitNumber(card.canonicalId);
    if (
      canonicalParts &&
      (next.setCode !== canonicalParts.setCode ||
        next.collectorNumber !== canonicalParts.collectorNumber)
    ) {
      notes.push(
        `${printing.id}: number (${next.setCode}, ${next.collectorNumber}) -> (${canonicalParts.setCode}, ${canonicalParts.collectorNumber})`,
      );
      next.setCode = canonicalParts.setCode;
      next.collectorNumber = canonicalParts.collectorNumber;
    }

    const apiEntry = selectApiEntry(card, printing.id);
    if (apiEntry) {
      if (next.imageUrl !== apiEntry.card_image) {
        notes.push(`${printing.id}: imageUrl -> ${apiEntry.card_image.split("/").pop()}`);
        next.imageUrl = apiEntry.card_image;
      }
      if (apiEntry.card_name !== card.name && apiEntry.card_name !== desuffixName(card.name)) {
        next.label = apiEntry.card_name;
      } else if (printing.label !== undefined) {
        notes.push(`${printing.id}: drop label`);
      }
    } else {
      const suffix = variantSuffix(printing.id);
      if (suffix !== null && !isKnownVariantSuffix(suffix)) {
        const candidates = (apiByNumber.get(card.canonicalId) ?? []).filter(
          (entry) =>
            normalizeProductSet(entry.productSet) === normalizeProductSet(card.setId) &&
            !claimedImageIds.has(entry.card_image_id) &&
            !seenIds.has(entry.card_image_id),
        );
        // prefer the candidate whose API display name matches the def name
        const nameMatched = candidates.filter((entry) => entry.card_name === card.name);
        const pool = nameMatched.length === 1 ? nameMatched : candidates;
        if (pool.length === 1) {
          const entry = pool[0];
          claimedImageIds.add(entry.card_image_id);
          if (existingPrintIds.has(entry.card_image_id) && entry.card_image_id !== printing.id) {
            // the API reuses this image id for another print; keep our unique id
            notes.push(`${printing.id}: art from API print ${entry.card_image_id} (id kept)`);
          } else {
            notes.push(`${printing.id}: reid -> ${entry.card_image_id}`);
            next.id = entry.card_image_id;
            next.artId = entry.card_image_id;
          }
          next.imageUrl = entry.card_image;
          if (entry.card_name !== card.name && entry.card_name !== desuffixName(card.name))
            next.label = entry.card_name;
        } else {
          unresolved.push(
            `${card.id} (${card.name}, setId ${card.setId}): ${pool.length} candidates for ${printing.id}`,
          );
        }
      }
    }

    // record only real field changes so re-runs converge
    const differs =
      next.id !== printing.id ||
      next.artId !== printing.artId ||
      next.setCode !== printing.setCode ||
      next.collectorNumber !== printing.collectorNumber ||
      next.imageUrl !== printing.imageUrl ||
      next.label !== printing.label;
    if (differs) changes.push(...notes);
    corrected.push(next);
  }

  // a printing already owned by the canonical base def is dropped from variants
  if (card.canonicalId !== card.id) {
    const base = cardById.get(card.canonicalId);
    if (base) {
      const baseIds = new Set(base.printings.map((p) => p.id));
      const kept = corrected.filter((p) => !baseIds.has(p.id));
      if (kept.length !== corrected.length) {
        for (const dropped of corrected.filter((p) => baseIds.has(p.id))) {
          changes.push(`drop printing ${dropped.id} (owned by base def ${base.id})`);
        }
        corrected.length = 0;
        corrected.push(...kept);
      }
    }
  }

  // canonical defs with suffixed display names get the printed name
  let rename = null;
  if (card.id === card.canonicalId) {
    const baseName = desuffixName(card.name);
    if (baseName !== card.name && baseName.length > 0) {
      rename = card.name;
      changes.push(`rename "${card.name}" -> "${baseName}"`);
      const primary = corrected.find((p) => p.id === card.id) ?? corrected[0];
      if (primary && primary.label === undefined) primary.label = card.name;
    }
  }

  // setId follows the primary print
  let setId = null;
  if (corrected[0] && corrected[0].setCode !== card.setId) {
    setId = corrected[0].setCode;
    changes.push(`setId ${card.setId} -> ${setId}`);
  }

  if (changes.length > 0) results.push({ card, printings: corrected, changes, rename, setId });
}

// ---------- report ----------
const lines = [
  `# printings repair — ${APPLY ? "APPLIED" : "dry run"}`,
  "",
  `API snapshot: ${apiByImageId.size} prints, ${apiByNumber.size} numbers (duplicate API image ids: ${apiDuplicateImageIds})`,
  `catalog defs: ${allCards.length}; defs changed: ${results.length}; unresolved: ${unresolved.length}; anomalies: ${anomalies.length}`,
  `multi-def source files (skipped for rewriting): ${multiDefFiles.length}`,
  "",
  "## unresolved (need manual decisions)",
  unresolved.length ? unresolved.map((u) => `- ${u}`).join("\n") : "(none)",
  "",
  "## anomalies",
  anomalies.length ? anomalies.map((a) => `- ${a}`).join("\n") : "(none)",
  "",
  "## changed defs",
  ...results.flatMap((r) => [
    `### ${r.card.id} — ${r.card.name}`,
    ...r.changes.map((c) => `- ${c}`),
  ]),
];
writeFileSync("/tmp/printings-repair-report.md", lines.join("\n") + "\n");
console.log(
  `defs changed: ${results.length}; unresolved: ${unresolved.length}; anomalies: ${anomalies.length}`,
);
console.log(
  `unresolved:\n${
    unresolved
      .slice(0, 20)
      .map((u) => "  " + u)
      .join("\n") || "  (none)"
  }`,
);
console.log(
  `anomalies:\n${
    anomalies
      .slice(0, 20)
      .map((a) => "  " + a)
      .join("\n") || "  (none)"
  }`,
);
console.log("report: /tmp/printings-repair-report.md");

// ---------- apply ----------
if (!APPLY) process.exit(0);

function renderPrintings(printings) {
  const entries = printings.map((p) => {
    const fields = [
      `      id: ${JSON.stringify(p.id)},`,
      `      artId: ${JSON.stringify(p.artId)},`,
      `      setCode: ${JSON.stringify(p.setCode)},`,
      `      collectorNumber: ${JSON.stringify(p.collectorNumber)},`,
      `      rarity: ${JSON.stringify(p.rarity)},`,
      `      imageUrl: ${JSON.stringify(p.imageUrl)},`,
    ];
    if (p.label !== undefined) fields.push(`      label: ${JSON.stringify(p.label)},`);
    return `    {\n${fields.join("\n")}\n    },`;
  });
  return `  printings: [\n${entries.join("\n")}\n  ],`;
}

let filesWritten = 0;
for (const result of results) {
  const { card, printings, rename, setId } = result;
  const file = fileForDefId.get(card.id);
  if (!file) {
    console.log(`SKIP (no single-def source file): ${card.id}`);
    continue;
  }
  let text = readFileSync(file, "utf8");

  const start = text.indexOf("  printings: [");
  if (start === -1) {
    console.log(`SKIP (no printings block): ${card.id}`);
    continue;
  }
  const endLine = text.indexOf("\n  ],", start);
  if (endLine === -1) {
    console.log(`SKIP (unterminated printings block): ${card.id}`);
    continue;
  }
  text = text.slice(0, start) + renderPrintings(printings) + text.slice(endLine + "\n  ],".length);

  if (rename) {
    const baseName = desuffixName(rename);
    // oxfmt emits single-quoted strings when the value contains double quotes
    const quote = rename.includes('"') ? "'" : '"';
    const newNameLine = `  name: ${quote}${baseName}${quote},`;
    const oldDouble = `  name: ${JSON.stringify(rename)},`;
    const oldSingle = `  name: '${rename}',`;
    if (text.includes(oldDouble)) {
      text = text.replace(oldDouble, newNameLine);
    } else if (text.includes(oldSingle)) {
      text = text.replace(oldSingle, newNameLine);
    } else {
      console.log(`SKIP (name line not found): ${card.id}`);
      continue;
    }
  }
  if (setId) {
    const setIdLine = `  setId: ${JSON.stringify(card.setId)},`;
    if (!text.includes(setIdLine)) {
      console.log(`SKIP (setId line not found): ${card.id}`);
      continue;
    }
    text = text.replace(setIdLine, `  setId: ${JSON.stringify(setId)},`);
  }
  writeFileSync(file, text);
  filesWritten++;

  if (rename) {
    const i18nFile = file.replace(/\.ts$/, ".i18n.ts");
    let i18nText = readFileSync(i18nFile, "utf8");
    const baseName = desuffixName(rename);
    const quote = rename.includes('"') ? "'" : '"';
    const i18nNameDouble = `    name: ${JSON.stringify(rename)},`;
    const i18nNameSingle = `    name: '${rename}',`;
    if (i18nText.includes(i18nNameDouble)) {
      i18nText = i18nText.replace(i18nNameDouble, `    name: ${JSON.stringify(baseName)},`);
    } else if (i18nText.includes(i18nNameSingle)) {
      i18nText = i18nText.replace(i18nNameSingle, `    name: ${quote}${baseName}${quote},`);
    } else {
      console.log(`WARN (i18n name line not found): ${i18nFile}`);
    }
    writeFileSync(i18nFile, i18nText);
  }
}
console.log(`\nwrote ${filesWritten} card files`);
