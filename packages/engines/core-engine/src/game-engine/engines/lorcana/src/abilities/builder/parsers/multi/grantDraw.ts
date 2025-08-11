import { AbilityBuilder } from "../../ability-builder";

// Pattern: "Chosen character gains Resist +2 until the start of your next turn. Draw a card. (...)"
export function parseResistUntilNextThenDraw(text: string) {
  const m = text.match(
    /^Chosen character gains (?:\*\*)?Resist(?:\*\*)? \+(\d+) until the start of your next turn\. Draw a card\./i,
  );
  if (!m) return null;
  const amount = Number.parseInt(m[1], 10);

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
    UNTIL_START_OF_YOUR_NEXT_TURN,
  } = require("~/game-engine/engines/lorcana/src/abilities/duration");
  const {
    resistAbility,
  } = require("~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility");

  // Keep original text (includes reminder text punctuation)
  return AbilityBuilder.static(text)
    .setTargets([chosenCharacterTarget])
    .setEffects([
      gainsAbilityEffect({
        ability: resistAbility(amount),
        duration: UNTIL_START_OF_YOUR_NEXT_TURN,
      }),
      drawCardEffect({ targets: [selfPlayerTarget] }),
    ])
    .build();
}
