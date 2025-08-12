import { AbilityBuilder } from "../../ability-builder";

export function parseDamageThenDraw(text: string) {
  const m = text.match(
    /^Deal (\d+) damage to chosen character\. Draw a card\.$/,
  );
  if (!m) return null;
  const amount = Number.parseInt(m[1], 10);
  const {
    dealDamageEffect,
    drawCardEffect,
  } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
  const {
    chosenCharacterTarget,
  } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
  const {
    selfPlayerTarget,
  } = require("~/game-engine/engines/lorcana/src/abilities/targets/player-target");
  return AbilityBuilder.static(text)
    .setEffects([
      dealDamageEffect({ targets: chosenCharacterTarget, value: amount }),
      drawCardEffect({ targets: [selfPlayerTarget] }),
    ])
    .build();
}
