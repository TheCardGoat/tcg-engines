/**
 * Lorcana Log Translation Contract
 *
 * Enforces:
 * - Every Lorcana log key exists in every required locale file.
 * - Every locale string uses the expected interpolation placeholders.
 */

import type { LorcanaLogMessageKey } from "../types/log-messages";
import { LORCANA_LOG_TRANSLATION_VALUE_KEYS } from "../types/log-messages";

import en from "../../messages/en.json";
import es from "../../messages/es.json";
import fr from "../../messages/fr.json";
import de from "../../messages/de.json";
import it from "../../messages/it.json";
import ptBr from "../../messages/pt-br.json";

export const REQUIRED_LORCANA_LOG_LOCALES = ["en", "es", "fr", "de", "it", "pt-br"] as const;

export type LorcanaLogLocale = (typeof REQUIRED_LORCANA_LOG_LOCALES)[number];

type LorcanaLogCatalog = Record<LorcanaLogMessageKey, string>;

const EN_MESSAGES = en satisfies LorcanaLogCatalog;
const ES_MESSAGES = es satisfies LorcanaLogCatalog;
const FR_MESSAGES = fr satisfies LorcanaLogCatalog;
const DE_MESSAGES = de satisfies LorcanaLogCatalog;
const IT_MESSAGES = it satisfies LorcanaLogCatalog;
const PT_BR_MESSAGES = ptBr satisfies LorcanaLogCatalog;

export const LORCANA_LOG_TRANSLATIONS_BY_LOCALE = {
  en: EN_MESSAGES,
  es: ES_MESSAGES,
  fr: FR_MESSAGES,
  de: DE_MESSAGES,
  it: IT_MESSAGES,
  "pt-br": PT_BR_MESSAGES,
} as const satisfies Record<LorcanaLogLocale, LorcanaLogCatalog>;

const PLACEHOLDER_PATTERN = /\{([a-zA-Z0-9_]+)\}/g;

function uniqueSorted(values: readonly string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function extractPlaceholders(message: string): string[] {
  return uniqueSorted([...message.matchAll(PLACEHOLDER_PATTERN)].map((match) => match[1]));
}

export function collectLorcanaLogTranslationIssues(): string[] {
  const issues: string[] = [];

  const logKeys = Object.keys(LORCANA_LOG_TRANSLATION_VALUE_KEYS) as LorcanaLogMessageKey[];

  for (const locale of REQUIRED_LORCANA_LOG_LOCALES) {
    const catalog = LORCANA_LOG_TRANSLATIONS_BY_LOCALE[locale];

    for (const key of logKeys) {
      const message = catalog[key];
      const expectedPlaceholders = uniqueSorted([...LORCANA_LOG_TRANSLATION_VALUE_KEYS[key]]);
      const actualPlaceholders = extractPlaceholders(message);

      const expectedSignature = expectedPlaceholders.join(",");
      const actualSignature = actualPlaceholders.join(",");

      if (expectedSignature !== actualSignature) {
        issues.push(
          `[${locale}] ${key}: expected placeholders [${expectedSignature}] but found [${actualSignature}]`,
        );
      }
    }
  }

  return issues;
}

export function assertLorcanaLogTranslationContract(): void {
  const issues = collectLorcanaLogTranslationIssues();
  if (issues.length === 0) return;

  const message = [
    "Lorcana log translation contract failed:",
    ...issues.map((issue) => `- ${issue}`),
  ].join("\n");

  throw new Error(message);
}
