import { AbilityBuilder } from "../../ability-builder";

// Chosen character gets -X {S} this turn. Chosen character of yours gains Evasive this turn.
export function parseStatThenAbility(text: string) {
  const m = text.match(
    /^Chosen character gets ([+-]?\d+) \{([SL])\} this turn\. Chosen character of yours gains (\w+) this turn\.$/,
  );
  if (!m) return null;
  const [, valueStr, statType, abilityNameRaw] = m;
  const value = Number.parseInt(valueStr, 10);
  const attribute = statType === "S" ? "strength" : "lore";
  const abilityName = abilityNameRaw.toLowerCase();

  const {
    getEffect,
    gainsAbilityEffect,
  } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
  const {
    chosenCharacterTarget,
    chosenCharacterOfYoursTarget,
  } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
  const {
    FOR_THE_REST_OF_THIS_TURN,
  } = require("~/game-engine/engines/lorcana/src/abilities/duration");
  const {
    evasiveAbility,
  } = require("~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility");

  if (abilityName !== "evasive") return null;

  const effects = [
    getEffect({
      targets: [chosenCharacterTarget],
      attribute,
      value,
      duration: FOR_THE_REST_OF_THIS_TURN,
    }),
    gainsAbilityEffect({
      targets: [chosenCharacterOfYoursTarget],
      ability: evasiveAbility,
      duration: FOR_THE_REST_OF_THIS_TURN,
    }),
  ];

  return AbilityBuilder.static(text).setEffects(effects).build();
}

// Chosen character gains Resist +2 until the start of your next turn. Draw a card. (reminder)
export function parseResistUntilNextThenDraw(text: string) {
  const m = text.match(
    /^Chosen character gains Resist \+(\d+) until the start of your next turn\. Draw a card\./,
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

  const normalizedText = text.endsWith(".") ? text : `${text}.`;
  return AbilityBuilder.static(normalizedText)
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
