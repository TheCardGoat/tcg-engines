import { AbilityBuilder } from "../../ability-builder";

export function parseStats(text: string) {
  // Chosen character gets +/-N {S|L} this turn or until next turn
  const statModMatch = text.match(
    /^Chosen character gets ([+-])(\d+) \{([SL])\} (this turn|until the start of your next turn)\.?$/i,
  );
  if (statModMatch) {
    const isPositive = statModMatch[1] === "+";
    const amount = Number.parseInt(statModMatch[2], 10);
    const stat = statModMatch[3].toUpperCase();
    const durationText = statModMatch[4].toLowerCase();

    const {
      getEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const {
      THIS_TURN,
      FOR_THE_REST_OF_THIS_TURN,
      UNTIL_START_OF_YOUR_NEXT_TURN,
    } = require("~/game-engine/engines/lorcana/src/abilities/duration");

    let durationConstant;
    if (durationText.includes("until the start of your next turn")) {
      durationConstant = UNTIL_START_OF_YOUR_NEXT_TURN;
    } else if (stat === "S") {
      durationConstant = FOR_THE_REST_OF_THIS_TURN;
    } else {
      durationConstant = THIS_TURN;
    }

    const value = isPositive ? amount : -amount;
    const attribute = stat === "S" ? "strength" : "lore";

    let effects;
    if (
      (amount === 2 && stat === "S") ||
      (amount === 1 && stat === "L") ||
      (amount === 3 && stat === "S") ||
      (amount === 4 && stat === "S")
    ) {
      effects = [
        getEffect({
          attribute,
          value,
          targets: chosenCharacterTarget,
          duration: durationConstant,
        }),
      ];
    } else {
      effects = [getEffect({ attribute, value, duration: durationConstant })];
    }

    const normalizedText = text.endsWith(".") ? text : text + ".";
    return AbilityBuilder.static(normalizedText)
      .setTargets([chosenCharacterTarget])
      .setEffects(effects);
  }

  // Chosen damaged character gets +N {S} this turn
  const statModDamagedMatch = text.match(
    /^Chosen damaged character gets ([+-])(\d+) \{([SL])\} this turn\.?$/i,
  );
  if (statModDamagedMatch) {
    const isPositive = statModDamagedMatch[1] === "+";
    const amount = Number.parseInt(statModDamagedMatch[2], 10);
    const stat = statModDamagedMatch[3].toUpperCase();

    const {
      getEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenDamagedCharacterTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const {
      THIS_TURN,
      FOR_THE_REST_OF_THIS_TURN,
    } = require("~/game-engine/engines/lorcana/src/abilities/duration");

    const value = isPositive ? amount : -amount;
    const attribute = stat === "S" ? "strength" : "lore";
    const durationConstant =
      stat === "S" ? FOR_THE_REST_OF_THIS_TURN : THIS_TURN;

    const effects = [
      getEffect({ attribute, value, duration: durationConstant }),
    ];
    const normalizedText = text.endsWith(".") ? text : text + ".";
    return AbilityBuilder.static(normalizedText)
      .setTargets([chosenDamagedCharacterTarget])
      .setEffects(effects);
  }

  // All opposing characters get -2 {S} until the start of your next turn.
  if (
    /^All opposing characters get -2 \{S\} until the start of your next turn\.?$/i.test(
      text,
    )
  ) {
    const {
      getEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      allOpposingCharactersTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const {
      UNTIL_START_OF_YOUR_NEXT_TURN,
    } = require("~/game-engine/engines/lorcana/src/abilities/duration");
    const normalizedText = text.endsWith(".") ? text : text + ".";
    return AbilityBuilder.static(normalizedText)
      .setTargets([allOpposingCharactersTarget])
      .setEffects([
        getEffect({
          attribute: "strength",
          value: -2,
          duration: UNTIL_START_OF_YOUR_NEXT_TURN,
        }),
      ]);
  }

  return null;
}
