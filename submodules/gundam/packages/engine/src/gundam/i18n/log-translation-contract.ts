/**
 * Gundam Log Translation Contract
 *
 * Enforces:
 * - Every Gundam log key exists in every required locale file.
 * - Every locale string uses the expected interpolation placeholders.
 */

import type { GundamLogMessageKey } from "../logging.ts";
import { GUNDAM_LOG_TRANSLATION_VALUE_KEYS } from "./translation-keys.ts";

import en from "../../../messages/en.json" with { type: "json" };

export const REQUIRED_GUNDAM_LOG_LOCALES = ["en"] as const;

export type GundamLogLocale = (typeof REQUIRED_GUNDAM_LOG_LOCALES)[number];

type GundamLogCatalog = Record<GundamLogMessageKey, string>;

const EN_MESSAGES = en as unknown as GundamLogCatalog;

export const GUNDAM_LOG_TRANSLATIONS_BY_LOCALE = {
  en: EN_MESSAGES,
} as const satisfies Record<GundamLogLocale, GundamLogCatalog>;

const PLACEHOLDER_PATTERN = /\{([a-zA-Z0-9_]+)\}/g;

function uniqueSorted(values: readonly string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function extractPlaceholders(message: string): string[] {
  return uniqueSorted([...message.matchAll(PLACEHOLDER_PATTERN)].map((match) => match[1]!));
}

export function collectGundamLogTranslationIssues(): string[] {
  const issues: string[] = [];
  const logKeys = Object.keys(GUNDAM_LOG_TRANSLATION_VALUE_KEYS) as GundamLogMessageKey[];

  for (const locale of REQUIRED_GUNDAM_LOG_LOCALES) {
    const catalog = GUNDAM_LOG_TRANSLATIONS_BY_LOCALE[locale];

    for (const key of logKeys) {
      const message = catalog[key];
      if (message === undefined) {
        issues.push(`[${locale}] ${key}: missing from locale file`);
        continue;
      }

      const expectedPlaceholders = uniqueSorted([...GUNDAM_LOG_TRANSLATION_VALUE_KEYS[key]]);
      const actualPlaceholders = extractPlaceholders(message);

      const missing = expectedPlaceholders.filter((p) => !actualPlaceholders.includes(p));
      const extra = actualPlaceholders.filter((p) => !expectedPlaceholders.includes(p));

      if (missing.length > 0) {
        issues.push(`[${locale}] ${key}: missing placeholders [${missing.join(", ")}]`);
      }
      if (extra.length > 0) {
        issues.push(`[${locale}] ${key}: extra placeholders [${extra.join(", ")}]`);
      }
    }
  }

  return issues;
}

export function assertGundamLogTranslationContract(): void {
  const issues = collectGundamLogTranslationIssues();
  if (issues.length === 0) return;

  const message = [
    "Gundam log translation contract failed:",
    ...issues.map((issue) => `- ${issue}`),
  ].join("\n");

  throw new Error(message);
}
