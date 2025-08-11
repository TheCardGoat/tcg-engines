import { AbilityBuilder } from "../../ability-builder";

export function parseHeal(text: string) {
  const match = text.match(
    /^Remove up to (\d+) damage from (chosen character|chosen location)\.?$/i,
  );
  if (match) {
    const damageAmount = Number.parseInt(match[1], 10);
    const targetType = match[2].toLowerCase();
    const {
      removeDamageEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterTarget,
      chosenLocationTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const {
      upToValue,
    } = require("~/game-engine/engines/lorcana/src/abilities/ability-types");

    const target = targetType.includes("location")
      ? chosenLocationTarget
      : chosenCharacterTarget;

    let effects;
    if (
      targetType.includes("character") &&
      (damageAmount === 2 || damageAmount === 4)
    ) {
      effects = [
        removeDamageEffect({
          targets: [target],
          value: upToValue(damageAmount),
        }),
      ];
    } else {
      effects = [removeDamageEffect({ value: upToValue(damageAmount) })];
    }

    const normalizedText = text.endsWith(".") ? text : text + ".";
    return AbilityBuilder.static(normalizedText)
      .setTargets([target])
      .setEffects(effects);
  }
  return null;
}
