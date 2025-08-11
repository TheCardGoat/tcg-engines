import { AbilityBuilder } from "../../ability-builder";

// Pattern: "Chosen character gains **Ward** and **Evasive** until the start of your next turn. _(…)_"
export function parseWardAndEvasiveUntilNextTurn(text: string) {
  const re =
    /^Chosen character gains (?:\*\*)?Ward(?:\*\*)? and (?:\*\*)?Evasive(?:\*\*)? until the start of your next turn\.(?:.*)$/i;
  if (!re.test(text)) return null;

  const {
    gainsAbilityEffect,
  } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
  const {
    chosenCharacterTarget,
  } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
  const {
    UNTIL_START_OF_YOUR_NEXT_TURN,
  } = require("~/game-engine/engines/lorcana/src/abilities/duration");
  const {
    wardAbility,
  } = require("~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility");
  const {
    evasiveAbility,
  } = require("~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility");

  // Normalize markdown in the first clause only; keep reminder text as-is
  const normalizedText = text
    .replace(/\*\*Ward\*\*/g, "Ward")
    .replace(/\*\*Evasive\*\*/g, "Evasive");

  return AbilityBuilder.static(normalizedText)
    .setTargets([chosenCharacterTarget])
    .setEffects([
      gainsAbilityEffect({
        ability: wardAbility,
        duration: UNTIL_START_OF_YOUR_NEXT_TURN,
      }),
      gainsAbilityEffect({
        ability: evasiveAbility,
        duration: UNTIL_START_OF_YOUR_NEXT_TURN,
      }),
    ])
    .build();
}
