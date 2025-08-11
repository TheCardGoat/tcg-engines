import { AbilityBuilder } from "../../ability-builder";

// Pattern: "Chosen character gains Support this turn. Draw a card." (plain, no markdown)
export function parseSupportThisTurnThenDraw(text: string) {
  if (
    !/^Chosen character gains Support this turn\. Draw a card\.?$/i.test(text)
  ) {
    return null;
  }

  const {
    gainsAbilityEffect,
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
  const {
    supportAbility,
  } = require("~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility");

  const normalizedText = text.endsWith(".") ? text : `${text}.`;

  return AbilityBuilder.static(normalizedText)
    .setEffects([
      gainsAbilityEffect({
        targets: [chosenCharacterTarget],
        ability: supportAbility,
        duration: FOR_THE_REST_OF_THIS_TURN,
      }),
      drawCardEffect({ targets: [selfPlayerTarget] }),
    ])
    .build();
}
