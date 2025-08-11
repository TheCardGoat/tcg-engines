import { AbilityBuilder } from "../../ability-builder";

export function parseBanishThenDraw(text: string) {
  if (!/^Banish chosen (item|character)\. Draw a card\.?$/i.test(text))
    return null;
  const {
    banishEffect,
    drawCardEffect,
  } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
  const {
    chosenItemTarget,
    chosenCharacterTarget,
  } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
  const {
    selfPlayerTarget,
  } = require("~/game-engine/engines/lorcana/src/abilities/targets/player-target");
  const isItem = /item/i.test(text);
  const normalizedText = text.endsWith(".") ? text : `${text}.`;

  if (isItem) {
    // Expected: ability-level target for item, effects without explicit targets
    return AbilityBuilder.static(normalizedText)
      .setTargets([chosenItemTarget])
      .setEffects([banishEffect(), drawCardEffect()])
      .build();
  }

  // Character case: effects carry explicit targets
  return AbilityBuilder.static(normalizedText)
    .setEffects([
      banishEffect({ targets: [chosenCharacterTarget] }),
      drawCardEffect({ targets: [selfPlayerTarget] }),
    ])
    .build();
}
