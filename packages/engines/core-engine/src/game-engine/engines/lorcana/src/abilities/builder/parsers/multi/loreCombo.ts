import { AbilityBuilder } from "../../ability-builder";

// Chosen opponent loses X lore. Gain Y lore.
export function parseLoreCombo(text: string) {
  const m = text.match(
    /^Chosen opponent loses (\d+) lore\. Gain (\d+) lore\.?$/i,
  );
  if (!m) return null;
  const loseAmount = Number.parseInt(m[1], 10);
  const gainAmount = Number.parseInt(m[2], 10);
  const {
    loseLoreEffect,
    gainLoreEffect,
  } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
  const {
    selfPlayerTarget,
  } = require("~/game-engine/engines/lorcana/src/abilities/targets/player-target");
  const anyPlayerTarget = { type: "player", value: "any" };
  const normalizedText = text.endsWith(".") ? text : text + ".";
  return AbilityBuilder.static(normalizedText)
    .setEffects([
      loseLoreEffect({ targets: [anyPlayerTarget], value: loseAmount }),
      gainLoreEffect({ targets: [selfPlayerTarget], value: gainAmount }),
    ])
    .build();
}
