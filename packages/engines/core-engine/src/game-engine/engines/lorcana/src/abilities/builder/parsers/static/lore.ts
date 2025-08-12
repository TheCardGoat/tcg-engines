import { AbilityBuilder } from "../../ability-builder";

export function parseLore(text: string) {
  const gainLoreMatch = text.match(/^Gain (\d+) lore\.?$/i);
  if (gainLoreMatch) {
    const amount = Number.parseInt(gainLoreMatch[1], 10);
    const {
      gainLoreEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      selfPlayerTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/player-target");
    const normalizedText = text.endsWith(".") ? text : text + ".";
    return AbilityBuilder.static(normalizedText)
      .setTargets([selfPlayerTarget])
      .setEffects([
        gainLoreEffect({ targets: [selfPlayerTarget], value: amount }),
      ]);
  }

  // Each opponent loses N lore.
  const eachOpponentLoseLoreMatch = text.match(
    /^Each opponent loses (\d+) lore\.?$/i,
  );
  if (eachOpponentLoseLoreMatch) {
    const value = Number.parseInt(eachOpponentLoseLoreMatch[1], 10);
    const {
      loseLoreEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    // Use exported target helper if available; otherwise construct inline
    const eachOpponentTarget = {
      type: "player" as const,
      value: "opponent" as const,
      targetAll: true,
    };
    const normalizedText = text.endsWith(".") ? text : text + ".";
    return AbilityBuilder.static(normalizedText)
      .setTargets([eachOpponentTarget as any])
      .setEffects([loseLoreEffect({ targets: [eachOpponentTarget], value })]);
  }
  return null;
}
