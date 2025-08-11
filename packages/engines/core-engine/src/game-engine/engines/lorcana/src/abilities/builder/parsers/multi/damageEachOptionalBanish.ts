import { AbilityBuilder } from "../../ability-builder";

// Pattern: "Deal 1 damage to each opposing character. You may banish chosen location."
export function parseDamageEachOpposingThenOptionalBanish(text: string) {
  if (
    !/^Deal 1 damage to each opposing character\. You may banish chosen location\.$/i.test(
      text,
    )
  )
    return null;

  const {
    dealDamageEffect,
    banishEffect,
  } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
  const {
    allOpposingCharactersTarget,
    chosenLocationTarget,
  } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");

  const normalizedText = text.endsWith(".") ? text : `${text}.`;
  return AbilityBuilder.static(normalizedText)
    .setTargets([allOpposingCharactersTarget])
    .setEffects([
      dealDamageEffect({ value: 1 }),
      banishEffect({ targets: [chosenLocationTarget], optional: true }),
    ])
    .build();
}
