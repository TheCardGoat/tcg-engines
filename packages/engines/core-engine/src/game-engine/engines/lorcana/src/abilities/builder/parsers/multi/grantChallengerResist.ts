import { AbilityBuilder } from "../../ability-builder";

// Pattern: "Chosen character gains **Challenger** +2 and **Resist** +2 this turn. _(…)_"
export function parseChallengerAndResistThisTurn(text: string) {
  const re =
    /^Chosen character gains \*\*Challenger\*\* \+(\d+) and \*\*Resist\*\* \+(\d+) this turn\./i;
  const m = text.match(re);
  if (!m) return null;
  const challengerAmt = Number.parseInt(m[1], 10);
  const resistAmt = Number.parseInt(m[2], 10);

  const {
    gainsAbilityEffect,
  } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
  const {
    chosenCharacterTarget,
  } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
  const {
    FOR_THE_REST_OF_THIS_TURN,
  } = require("~/game-engine/engines/lorcana/src/abilities/duration");
  const {
    challengerAbility,
  } = require("~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility");
  const {
    resistAbility,
  } = require("~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility");

  // Keep original text (with reminder after), ability-level targets
  return AbilityBuilder.static(text)
    .setTargets([chosenCharacterTarget])
    .setEffects([
      gainsAbilityEffect({
        ability: challengerAbility(challengerAmt),
        duration: FOR_THE_REST_OF_THIS_TURN,
      }),
      gainsAbilityEffect({
        ability: resistAbility(resistAmt),
        duration: FOR_THE_REST_OF_THIS_TURN,
      }),
    ])
    .build();
}
