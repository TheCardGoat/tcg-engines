import enMessages from "../../messages/en.json";
import * as paraglideBarrel from "$lib/paraglide/messages.js";

const generatedMessages = paraglideBarrel.m;

export * from "$lib/paraglide/messages.js";

/** Paraglide message id — keep in sync with `src/messages/en.json` fallback keys below. */
const archetypeIntroKey = "sim.matchmaking.archetype.intro";
const archetypeUserMatchesTitleKey = "sim.matchmaking.archetype.userMatches.title";

// Access dot-separated message keys dynamically to avoid hard module-link
// failures when the compiled paraglide barrel doesn't export them yet.
const simMatchmakingArchetypeIntroParaglide = (paraglideBarrel as Record<string, unknown>)[
  archetypeIntroKey
];
const simMatchmakingArchetypeUserMatchesTitleParaglide = (
  paraglideBarrel as Record<string, unknown>
)[archetypeUserMatchesTitleKey];

type Locale = "en" | "de" | "it" | "es" | "pt-br";
type LocalizedString = string;
export type SimulatorMessageTranslator = (
  inputs?: Record<string, unknown>,
  options?: { locale?: Locale },
) => LocalizedString;

function renderWithValues(messageTemplate: unknown, values: Record<string, unknown> = {}): string {
  if (typeof messageTemplate !== "string") {
    return String(messageTemplate);
  }

  return messageTemplate.replace(/\{([^{}]+)\}/g, (_, key) =>
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : `{${key}}`,
  );
}

function getFallbackMessage(
  propertyKey: string,
  inputs: Record<string, unknown> = {},
): LocalizedString {
  const fallbackMessage = (enMessages as Record<string, unknown>)[propertyKey];
  if (typeof fallbackMessage === "string") {
    return renderWithValues(fallbackMessage, inputs);
  }

  return `[${propertyKey}]`;
}

function isUnresolvedGeneratedMessage(propertyKey: string, value: unknown): boolean {
  return value === propertyKey || value === `[${propertyKey}]`;
}

export const m = new Proxy(
  generatedMessages as unknown as Record<string, SimulatorMessageTranslator>,
  {
    get(target, propertyKey) {
      if (typeof propertyKey !== "string") {
        return Reflect.get(target, propertyKey);
      }

      const message = Reflect.get(target, propertyKey);
      if (typeof message === "function") {
        return (
          inputs: Record<string, unknown> = {},
          options?: { locale?: Locale },
        ): LocalizedString => {
          try {
            const localized = (message as SimulatorMessageTranslator)(inputs, options);
            if (!isUnresolvedGeneratedMessage(propertyKey, localized)) {
              return localized;
            }
          } catch {
            // Fall back to the English catalog in SSR test environments where
            // Paraglide runtime state is not initialized.
          }

          return getFallbackMessage(propertyKey, inputs);
        };
      }

      return (
        inputs: Record<string, unknown> = {},
        _options?: { locale?: Locale },
      ): LocalizedString => getFallbackMessage(propertyKey, inputs);
    },
  },
) as Record<string, SimulatorMessageTranslator>;

/** Archetype lobby hero copy — import stable Paraglide barrel exports so builds work without per-file `messages/*.js` paths (gitignored output; filenames can gain numeric suffixes). */
export const simMatchmakingArchetypeIntro: SimulatorMessageTranslator =
  typeof simMatchmakingArchetypeIntroParaglide === "function"
    ? (simMatchmakingArchetypeIntroParaglide as SimulatorMessageTranslator)
    : (inputs = {}) => {
        const template =
          (enMessages as Record<string, unknown>)[archetypeIntroKey] ??
          "Create a match by specifying which archetype you want to find. The purpose of this feature is to help you test a specific matchup as thoroughly as possible.";
        return renderWithValues(template, inputs) as LocalizedString;
      };

/** Archetype match list card title — same stable barrel import as intro. */
export const simMatchmakingArchetypeUserMatchesTitle: SimulatorMessageTranslator =
  typeof simMatchmakingArchetypeUserMatchesTitleParaglide === "function"
    ? (simMatchmakingArchetypeUserMatchesTitleParaglide as SimulatorMessageTranslator)
    : (inputs = {}) => {
        const template =
          (enMessages as Record<string, unknown>)[archetypeUserMatchesTitleKey] ??
          "Matches Created by Players";
        return renderWithValues(template, inputs) as LocalizedString;
      };
