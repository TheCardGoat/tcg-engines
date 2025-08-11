import { AbilityBuilder } from "../../ability-builder";

export function parseHealThenDraw(text: string) {
  const m = text.match(
    /^Remove up to (\d+) damage from chosen character\. Draw a card\.$/,
  );
  if (!m) return null;
  const amount = Number.parseInt(m[1], 10);
  const {
    removeDamageEffect,
    drawCardEffect,
  } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
  const {
    upToValue,
  } = require("~/game-engine/engines/lorcana/src/abilities/ability-types");
  const {
    chosenCharacterTarget,
  } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
  const {
    selfPlayerTarget,
  } = require("~/game-engine/engines/lorcana/src/abilities/targets/player-target");
  return AbilityBuilder.static(text)
    .setTargets([chosenCharacterTarget])
    .setEffects([
      removeDamageEffect({ value: upToValue(amount) }),
      drawCardEffect({ targets: [selfPlayerTarget] }),
    ])
    .build();
}
