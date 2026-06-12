import { readFile } from "node:fs/promises";

const LOCALES = ["en", "es", "de", "it", "pt-br"] as const;
const BASE_LOCALE = "en" as const;
const PLACEHOLDER_PATTERN = /\{([a-zA-Z0-9_]+)\}/g;

type Locale = (typeof LOCALES)[number];
type Catalog = Record<string, string>;

function uniqueSorted(values: readonly string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function extractPlaceholders(message: string): string[] {
  return uniqueSorted([...message.matchAll(PLACEHOLDER_PATTERN)].map((match) => match[1] ?? ""));
}

async function loadCatalog(locale: Locale): Promise<Catalog> {
  const file = new URL(`../src/messages/${locale}.json`, import.meta.url);
  const raw = await readFile(file, "utf8");
  return JSON.parse(raw) as Catalog;
}

function getMessageKeys(catalog: Catalog): string[] {
  return Object.keys(catalog)
    .filter((key) => key !== "$schema")
    .sort((left, right) => left.localeCompare(right));
}

try {
  const catalogs = Object.fromEntries(
    await Promise.all(LOCALES.map(async (locale) => [locale, await loadCatalog(locale)] as const)),
  ) as Record<Locale, Catalog>;

  const baseCatalog = catalogs[BASE_LOCALE];
  const baseKeys = getMessageKeys(baseCatalog);
  const issues: string[] = [];

  for (const locale of LOCALES) {
    const currentCatalog = catalogs[locale];
    const currentKeys = getMessageKeys(currentCatalog);
    const currentKeySet = new Set(currentKeys);

    for (const key of baseKeys) {
      if (!currentKeySet.has(key)) {
        issues.push(`[${locale}] missing key: ${key}`);
      }
    }

    for (const key of currentKeys) {
      if (!(key in baseCatalog)) {
        issues.push(`[${locale}] unexpected key not present in ${BASE_LOCALE}: ${key}`);
      }
    }

    for (const key of baseKeys) {
      const baseMessage = baseCatalog[key];
      const currentMessage = currentCatalog[key];

      if (typeof currentMessage !== "string") {
        continue;
      }

      const expected = extractPlaceholders(baseMessage).join(",");
      const actual = extractPlaceholders(currentMessage).join(",");

      if (expected !== actual) {
        issues.push(
          `[${locale}] ${key}: expected placeholders [${expected}] but found [${actual}]`,
        );
      }
    }
  }

  if (issues.length === 0) {
    process.exit(0);
  }

  for (const issue of issues) {
    console.error(issue);
  }
  process.exit(1);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
