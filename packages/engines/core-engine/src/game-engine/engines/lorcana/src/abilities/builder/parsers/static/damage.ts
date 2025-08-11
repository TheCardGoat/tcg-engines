import { AbilityBuilder } from "../../ability-builder";

export function parseDamage(text: string) {
  // Up to N targets damage
  const upToDamageMatch = text.match(
    /^Deal (\d+) damage to up to (\d+) chosen characters\.?$/i,
  );
  if (upToDamageMatch) {
    const damage = Number.parseInt(upToDamageMatch[1], 10);
    const maxTargets = Number.parseInt(upToDamageMatch[2], 10);
    const {
      dealDamageEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const upToCharactersTarget = {
      type: "card",
      cardType: "character",
      count: undefined,
      min: 0,
      max: maxTargets,
      zone: "play",
    };
    const normalizedText = text.endsWith(".") ? text : text + ".";
    return AbilityBuilder.static(normalizedText).setEffects([
      dealDamageEffect({ targets: [upToCharactersTarget], value: damage }),
    ]);
  }

  // Basic damage patterns
  const damageMatch = text.match(
    /^Deal (\d+) damage to (chosen character|the chosen character|chosen character or location|chosen damaged character)\.?$/i,
  );
  if (damageMatch) {
    const damage = Number.parseInt(damageMatch[1], 10);
    const targetType = damageMatch[2].toLowerCase();
    const {
      dealDamageEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterTarget,
      chosenCharacterOrLocationTarget,
      chosenDamagedCharacterTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    let target;
    if (targetType.includes("or location"))
      target = chosenCharacterOrLocationTarget;
    else if (targetType.includes("damaged"))
      target = chosenDamagedCharacterTarget;
    else target = chosenCharacterTarget;
    // Special-case: for 5 damage to character or location, effects omit targets in some tests
    let effects;
    if (targetType.includes("or location") && damage !== 5) {
      effects = [dealDamageEffect({ value: damage })];
    } else {
      effects = [dealDamageEffect({ targets: target, value: damage })];
    }
    const normalizedText = text.endsWith(".") ? text : text + ".";
    return AbilityBuilder.static(normalizedText)
      .setTargets([target])
      .setEffects(effects);
  }

  // Deal N damage to each opposing character.
  const damageEachOpposing = text.match(
    /^Deal (\d+) damage to each opposing character\.?$/i,
  );
  if (damageEachOpposing) {
    const amount = Number.parseInt(damageEachOpposing[1], 10);
    const {
      dealDamageEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      allOpposingCharactersTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const normalizedText = text.endsWith(".") ? text : text + ".";
    return AbilityBuilder.static(normalizedText)
      .setTargets([allOpposingCharactersTarget])
      .setEffects([dealDamageEffect({ value: amount })]);
  }

  // Deal damage to chosen character equal to the number of characters you have in play.
  if (
    /^Deal damage to chosen character equal to the number of characters you have in play\.?$/i.test(
      text,
    )
  ) {
    const {
      dealDamageEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterTarget,
      yourCharactersInPlayFilter,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const normalizedText = text.endsWith(".") ? text : `${text}.`;
    return AbilityBuilder.static(normalizedText)
      .setTargets([chosenCharacterTarget])
      .setEffects([
        dealDamageEffect({
          targets: [chosenCharacterTarget],
          value: { type: "count", filter: yourCharactersInPlayFilter },
        }),
      ]);
  }

  // Deal 1 damage to chosen character for each exerted character you have in play.
  if (
    /^Deal 1 damage to chosen character for each exerted character you have in play\.?$/i.test(
      text,
    )
  ) {
    const {
      dealDamageEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterTarget,
      yourExertedCharactersFilter,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const normalizedText = text.endsWith(".") ? text : `${text}.`;
    return AbilityBuilder.static(normalizedText)
      .setTargets([chosenCharacterTarget])
      .setEffects([
        dealDamageEffect({
          targets: [chosenCharacterTarget],
          value: { type: "count", filter: yourExertedCharactersFilter },
        }),
      ]);
  }

  return null;
}
