import { AbilityBuilder } from "../../ability-builder";

// Gain X lore. Draw a card.
export function parseLoreThenDraw(text: string) {
  const m = text.match(/^Gain (\d+) lore\. Draw a card\.?$/i);
  if (!m) return null;
  const value = Number.parseInt(m[1], 10);
  const {
    gainLoreEffect,
    drawCardEffect,
  } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
  const {
    selfPlayerTarget,
  } = require("~/game-engine/engines/lorcana/src/abilities/targets/player-target");
  return AbilityBuilder.static(text)
    .setEffects([
      gainLoreEffect({ targets: [selfPlayerTarget], value }),
      drawCardEffect({ targets: [selfPlayerTarget] }),
    ])
    .build();
}
