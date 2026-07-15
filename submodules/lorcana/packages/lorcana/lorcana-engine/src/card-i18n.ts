import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export function createCardI18n(
  name: string,
  overrides: Partial<Record<Languages, I18nProperties>> = {},
): Record<Languages, I18nProperties> {
  const english = overrides.en ?? { name };

  return {
    en: english,
    de: overrides.de ?? english,
    fr: overrides.fr ?? english,
    it: overrides.it ?? english,
  };
}
