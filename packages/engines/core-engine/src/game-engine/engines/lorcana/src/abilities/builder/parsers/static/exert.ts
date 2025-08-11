import { AbilityBuilder } from "../../ability-builder";

export function parseExert(text: string) {
  // Exert chosen opposing character.
  if (/^Exert chosen opposing character\.?$/i.test(text)) {
    const target = {
      type: "card" as const,
      cardType: "character" as const,
      owner: "opponent" as const,
      count: 1,
    };
    const normalizedText = text.endsWith(".") ? text : `${text}.`;
    return AbilityBuilder.static(normalizedText)
      .setTargets([target])
      .setEffects([{ type: "exert" }]);
  }

  return null;
}
