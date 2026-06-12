import { readFile, readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const BASE_LOCALE = "en" as const;
const MESSAGE_KEY_PATTERN = /m\[['"]([a-zA-Z][a-zA-Z0-9_.]*?)['"]]/g;
const IGNORED_KEYS = new Set(["sim._", "mode"]);

type Catalog = Record<string, string>;

async function loadCatalog(): Promise<Catalog> {
  const file = new URL(`../src/messages/${BASE_LOCALE}.json`, import.meta.url);
  const raw = await readFile(file, "utf8");
  return JSON.parse(raw) as Catalog;
}

async function* walkDir(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name === "node_modules" ||
        entry.name === ".svelte-kit" ||
        entry.name === "paraglide"
      ) {
        continue;
      }
      yield* walkDir(path);
    } else if (entry.isFile()) {
      const ext = extname(entry.name);
      if (ext === ".svelte" || ext === ".ts") {
        yield path;
      }
    }
  }
}

async function extractKeysFromFile(filePath: string): Promise<Set<string>> {
  const content = await readFile(filePath, "utf8");
  const keys = new Set<string>();

  for (const match of content.matchAll(MESSAGE_KEY_PATTERN)) {
    const key = match[1];
    if (key && !IGNORED_KEYS.has(key)) {
      keys.add(key);
    }
  }

  return keys;
}

async function getAllUsedKeys(srcDir: string): Promise<Map<string, string[]>> {
  const keyToFiles = new Map<string, string[]>();

  for await (const filePath of walkDir(srcDir)) {
    if (filePath.includes(".test.") || filePath.includes("/testing/")) {
      continue;
    }
    const keys = await extractKeysFromFile(filePath);
    for (const key of keys) {
      const files = keyToFiles.get(key) ?? [];
      files.push(filePath.replace(srcDir, "src"));
      keyToFiles.set(key, files);
    }
  }

  return keyToFiles;
}

try {
  const srcDir = new URL("../src", import.meta.url).pathname;
  const catalog = await loadCatalog();
  const availableKeys = new Set(Object.keys(catalog).filter((k) => k !== "$schema"));
  const usedKeys = await getAllUsedKeys(srcDir);

  const missingKeys: { key: string; files: string[] }[] = [];

  for (const [key, files] of usedKeys) {
    if (!availableKeys.has(key)) {
      missingKeys.push({ key, files });
    }
  }

  if (missingKeys.length === 0) {
    console.log("All translation keys used in code are defined.");
    process.exit(0);
  }

  console.error("Missing translation keys detected in code:");
  for (const { key, files } of missingKeys.sort((a, b) => a.key.localeCompare(b.key))) {
    console.error(`  ${key}`);
    for (const file of new Set(files)) {
      console.error(`    - ${file}`);
    }
  }
  process.exit(1);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
