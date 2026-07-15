import enMessages from "../../messages/en.json" with { type: "json" };

type Locale = "en";
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

export const m = new Proxy({} as Record<string, SimulatorMessageTranslator>, {
  get(target, propertyKey) {
    if (typeof propertyKey !== "string") {
      return Reflect.get(target, propertyKey);
    }

    return (
      inputs: Record<string, unknown> = {},
      _options?: { locale?: Locale },
    ): LocalizedString => getFallbackMessage(propertyKey, inputs);
  },
}) as Record<string, SimulatorMessageTranslator>;
