import { AbilityBuilder } from "../../ability-builder";

// Pattern: "Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn."
export function parseOpponentDiscardThenBuff(text: string) {
  if (
    !/^Chosen opponent chooses and discards a card\. Chosen character gets \+2 \{S\} this turn\.$/i.test(
      text,
    )
  )
    return null;

  const {
    discardCardEffect,
    getEffect,
  } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
  const {
    chosenOpponentTarget,
  } = require("~/game-engine/engines/lorcana/src/abilities/targets/player-target");
  const {
    chosenCharacterTarget,
  } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
  const {
    THIS_TURN,
  } = require("~/game-engine/engines/lorcana/src/abilities/duration");

  const normalizedText = text.endsWith(".") ? text : `${text}.`;
  return AbilityBuilder.static(normalizedText)
    .setEffects([
      discardCardEffect({ targets: [chosenOpponentTarget], value: 1 }),
      getEffect({
        attribute: "strength",
        value: 2,
        duration: THIS_TURN,
        targets: [chosenCharacterTarget],
      }),
    ])
    .build();
}
