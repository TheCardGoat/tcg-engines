import { AbilityBuilder } from "../../ability-builder";

// Chosen character gets +/-X {S|L} this turn. Draw a card.
export function parseStatThenDraw(text: string) {
  const m = text.match(
    /^Chosen character gets ([+-]?\d+) \{([SL])\} this turn\. Draw a card\.$/,
  );
  if (!m) return null;
  const [, valueStr, statType] = m;
  const value = Number.parseInt(valueStr, 10);
  const attribute = statType === "S" ? "strength" : "lore";

  const {
    getEffect,
    drawCardEffect,
  } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
  const {
    chosenCharacterTarget,
  } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
  const {
    selfPlayerTarget,
  } = require("~/game-engine/engines/lorcana/src/abilities/targets/player-target");
  const {
    FOR_THE_REST_OF_THIS_TURN,
  } = require("~/game-engine/engines/lorcana/src/abilities/duration");

  const isPositive = value > 0;
  const effects = [
    getEffect({
      attribute,
      value,
      targets: isPositive ? chosenCharacterTarget : [chosenCharacterTarget],
      duration: FOR_THE_REST_OF_THIS_TURN,
    }),
    drawCardEffect({ targets: [selfPlayerTarget] }),
  ];

  const builder = AbilityBuilder.static(text).setEffects(effects);
  if (isPositive) builder.setTargets([chosenCharacterTarget]);
  return builder.build();
}
