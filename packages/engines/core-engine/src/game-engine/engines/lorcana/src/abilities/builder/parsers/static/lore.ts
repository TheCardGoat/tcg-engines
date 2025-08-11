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
  return null;
}
