import * as generatedMessages from "$lib/paraglide/messages.js";
import enMessages from "../../messages/en.json";

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
