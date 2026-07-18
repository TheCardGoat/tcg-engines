#!/usr/bin/env bun

import fs from "node:fs";
import path from "node:path";

const PACKAGE_ROOT = path.resolve(import.meta.dir, "..");
const INVENTORY_PATH = path.join(PACKAGE_ROOT, "data/spanish-translation-inventory.csv");
const CARD_ROOT = path.join(PACKAGE_ROOT, "src/cards");
const API_URL = "https://translate.googleapis.com/translate_a/single";
const FIELD_SEPARATOR = "ZZZCARDGOATFIELDZZZ";
const CONCURRENCY = 8;
const KEYWORD_NAMES = [
  "Bodyguard",
  "Sing Together",
  "Challenger",
  "Reckless",
  "Evasive",
  "Support",
  "Vanish",
  "Resist",
  "Singer",
  "Alert",
  "Boost",
  "Shift",
  "Rush",
  "Ward",
] as const;
const KEYWORD_PATTERN = new RegExp(
  `\\b(?:${KEYWORD_NAMES.join("|")})\\b(?:\\s+(?:\\+\\d+|\\d+))?`,
  "g",
);

type JsonRecord = Record<string, unknown>;

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function inventoryPaths(): string[] {
  const rows = parseCsv(fs.readFileSync(INVENTORY_PATH, "utf8"));
  const header = rows[0];
  const index = header.indexOf("i18n_file_to_update");
  if (index < 0) throw new Error("Inventory has no i18n_file_to_update column");
  return [...new Set(rows.slice(1).map((row) => row[index]).filter(Boolean))];
}

function findObjectEnd(content: string, start: number): number {
  let depth = 0;
  let quote: string | undefined;
  let escaped = false;
  for (let i = start; i < content.length; i++) {
    const char = content[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = undefined;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
    } else if (char === "{") {
      depth++;
    } else if (char === "}" && --depth === 0) {
      return i + 1;
    }
  }
  throw new Error("Unterminated i18n object");
}

function extractObject(content: string): { start: number; end: number; value: JsonRecord } {
  const assignmentMatch = content.match(/=\s*\{/);
  if (!assignmentMatch || assignmentMatch.index == null) throw new Error("Could not locate i18n object");
  const start = assignmentMatch.index + assignmentMatch[0].length - 1;
  const end = findObjectEnd(content, start);
  const value = new Function(`return (${content.slice(start, end)})`)() as JsonRecord;
  return { start, end, value };
}

function protectTokens(value: string): { protectedValue: string; tokens: string[] } {
  const tokens: string[] = [];
  const protect = (token: string): string => {
    const marker = `ZZZCARDGOATTOKEN${tokens.length}ZZZ`;
    tokens.push(token);
    return marker;
  };
  const protectedValue = value
    .replace(/\{[^}]+\}/g, protect)
    .replace(KEYWORD_PATTERN, protect);
  return { protectedValue, tokens };
}

function restoreTokens(value: string, tokens: string[]): string {
  return value.replace(/ZZZCARDGOATTOKEN(\d+)ZZZ/g, (_, index) => tokens[Number(index)] ?? "");
}

async function translateText(value: string, cache: Map<string, string>): Promise<string> {
  if (!value.trim() || cache.has(value)) return cache.get(value) ?? value;
  const { protectedValue, tokens } = protectTokens(value);
  const params = new URLSearchParams({
    client: "gtx",
    sl: "en",
    tl: "es",
    dt: "t",
    q: protectedValue,
  });
  let response: Response | undefined;
  for (let attempt = 0; attempt < 5; attempt++) {
    response = await fetch(`${API_URL}?${params.toString()}`);
    if (response.ok) break;
    if (attempt < 4) await Bun.sleep(250 * 2 ** attempt);
  }
  if (!response?.ok) throw new Error(`Translation request failed: ${response?.status ?? "unknown"}`);
  const payload = (await response.json()) as unknown[][];
  const translated = (payload[0] ?? [])
    .map((segment) => (typeof segment?.[0] === "string" ? segment[0] : ""))
    .join("");
  if (!translated) throw new Error(`Translation returned empty text for ${JSON.stringify(value)}`);
  const result = restoreTokens(translated, tokens);
  cache.set(value, result);
  return result;
}

async function translateValue(value: unknown, cache: Map<string, string>): Promise<unknown> {
  if (typeof value === "string") return translateText(value, cache);
  if (Array.isArray(value)) {
    return Promise.all(value.map((entry) => translateValue(entry, cache)));
  }
  if (value && typeof value === "object") {
    const result: JsonRecord = {};
    for (const [key, entry] of Object.entries(value)) {
      result[key] = await translateValue(entry, cache);
    }
    return result;
  }
  return value;
}

function formatObject(value: JsonRecord): string {
  return JSON.stringify(value, null, 2).replace(/"([^"\\]+)":/g, "$1:");
}

function formatObjectAtIndent(value: JsonRecord, indent: string): string {
  return formatObject(value).replace(/\n/g, `\n${indent}`);
}

function insertLocale(
  content: string,
  object: { start: number; end: number },
  locale: string,
  value: JsonRecord,
): string {
  const raw = content.slice(object.start, object.end);
  const closingIndent = raw.match(/\n([ \t]*)}$/)?.[1] ?? "";
  const body = raw.slice(0, -(closingIndent.length + 1));
  const propertyIndent = raw.match(/\n([ \t]+)en:/)?.[1] ?? "  ";
  const needsComma = !body.trimEnd().endsWith(",");
  const updated = `${body}${needsComma ? "," : ""}\n${propertyIndent}${locale}: ${formatObjectAtIndent(value, propertyIndent)}\n${closingIndent}}`;
  return `${content.slice(0, object.start)}${updated}${content.slice(object.end)}`;
}

function replaceLocale(
  content: string,
  object: { start: number; end: number },
  locale: string,
  value: JsonRecord,
): string {
  const raw = content.slice(object.start, object.end);
  const property = new RegExp(`(^|\\n)([ \\t]*)${locale}:\\s*\\{`, "m").exec(raw);
  if (!property || property.index == null) throw new Error(`Could not locate ${locale} locale`);
  const propertyIndent = property[2];
  const valueStart = object.start + property.index + property[0].lastIndexOf("{");
  const valueEnd = findObjectEnd(content, valueStart);
  return `${content.slice(0, valueStart)}${formatObjectAtIndent(value, propertyIndent)}${content.slice(valueEnd)}`;
}

function repairMistranslatedShiftTitles(content: string): string {
  return content.replace(/^(\s*title:\s*)"Turno (?=\d)/gm, '$1"Shift ');
}

function capitalizeInitial(value: unknown, reference: unknown): unknown {
  if (typeof value !== "string" || typeof reference !== "string" || !value || !reference) return value;
  if (!/^\p{Lu}/u.test(reference) || !/^\p{Ll}/u.test(value)) return value;
  return value[0].toLocaleUpperCase("es-ES") + value.slice(1);
}

function normalizeSpanish(english: JsonRecord, spanish: JsonRecord): JsonRecord {
  return {
    ...spanish,
    name: capitalizeInitial(spanish.name, english.name),
    ...(spanish.version ? { version: capitalizeInitial(spanish.version, english.version) } : {}),
  };
}

async function main(): Promise<void> {
  const paths = inventoryPaths();
  const cache = new Map<string, string>();
  const repairKeywords = Bun.argv.includes("--repair-keywords");
  let cursor = 0;
  let completed = 0;
  const worker = async (): Promise<void> => {
    while (true) {
      const index = cursor++;
      if (index >= paths.length) return;
      const relativePath = paths[index];
      const filePath = path.join(PACKAGE_ROOT, relativePath);
      const content = fs.readFileSync(filePath, "utf8");
      let object: { start: number; end: number; value: JsonRecord };
      try {
        object = extractObject(content);
      } catch (error) {
        throw new Error(`${relativePath}: ${error instanceof Error ? error.message : String(error)}`);
      }
      const english = object.value.en;
      if (!english || typeof english !== "object") throw new Error(`Missing English locale in ${relativePath}`);
      const existingSpanish = object.value.es;
      if (existingSpanish && JSON.stringify(existingSpanish) !== JSON.stringify(english)) {
        const repairedContent = repairKeywords ? repairMistranslatedShiftTitles(content) : content;
        if (repairedContent !== content) {
          fs.writeFileSync(filePath, repairedContent);
        }
        completed++;
        continue;
      }
      const translatedSpanish = normalizeSpanish(
        english as JsonRecord,
        await translateValue(english, cache) as JsonRecord,
      );
      fs.writeFileSync(
        filePath,
        object.value.es
          ? replaceLocale(content, object, "es", translatedSpanish)
          : insertLocale(content, object, "es", translatedSpanish),
      );
      completed++;
      if (completed % 100 === 0 || completed === paths.length) {
        console.log(`Translated ${completed}/${paths.length} files (${cache.size} unique strings)`);
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, paths.length) }, worker));
}

async function audit(): Promise<void> {
  const rows = parseCsv(fs.readFileSync(INVENTORY_PATH, "utf8"));
  const header = rows[0];
  const pathIndex = header.indexOf("i18n_file_to_update");
  const statusIndex = header.indexOf("spanish_status");
  const paths = [...new Set(rows.slice(1).map((row) => row[pathIndex]).filter(Boolean))];
  const allFiles: string[] = [];
  for await (const file of new Bun.Glob("src/cards/**/*.i18n.ts").scan({ cwd: PACKAGE_ROOT })) allFiles.push(file);
  let missingEs = 0;
  let tokenMismatch = 0;
  let identicalLocales = 0;
  let parseErrors = 0;
  const tokens = (value: unknown): string[] => {
    const result: string[] = [];
    const collect = (entry: unknown): void => {
      if (typeof entry === "string") {
        result.push(...[...entry.matchAll(/\{[^{}]+\}/g)].map((match) => match[0]));
      } else if (Array.isArray(entry)) {
        entry.forEach(collect);
      } else if (entry && typeof entry === "object") {
        Object.values(entry).forEach(collect);
      }
    };
    collect(value);
    return result.sort();
  };
  for (const relativePath of paths) {
    try {
      const value = extractObject(fs.readFileSync(path.join(PACKAGE_ROOT, relativePath), "utf8")).value;
      if (!value.es) missingEs++;
      else {
        if (JSON.stringify(tokens(value.en)) !== JSON.stringify(tokens(value.es))) tokenMismatch++;
        if (JSON.stringify(value.en) === JSON.stringify(value.es)) identicalLocales++;
      }
    } catch {
      parseErrors++;
    }
  }
  const translatedStatuses = rows.slice(1).filter((row) => row[statusIndex] === "translated").length;
  console.log(JSON.stringify({
    inventoryRows: rows.length - 1,
    inventoryUniquePaths: paths.length,
    i18nFiles: allFiles.length,
    missingEs,
    tokenMismatch,
    identicalLocales,
    parseErrors,
    translatedStatuses,
    filesOutsideInventory: allFiles.filter((file) => !paths.includes(file)).length,
  }, null, 2));
}

if (Bun.argv.includes("--audit")) await audit();
else await main();
