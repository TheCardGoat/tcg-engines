import { AbilityBuilder } from "../ability-builder";

// Centralized multi-effect pattern handling that should not be split by periods
export function parseMultiEffectPatterns(text: string) {
  const cleanText = text.trim();
  if (!cleanText) return null;

  // Support + Draw pattern (simple version)
  const supportDrawMatch = cleanText.includes(
    "gains **Support** this turn. Draw a card",
  );
  if (supportDrawMatch) {
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

    const effects = [
      gainsAbilityEffect({
        targets: [chosenCharacterTarget],
        ability: supportAbility,
        duration: FOR_THE_REST_OF_THIS_TURN,
      }),
      drawCardEffect({ targets: [selfPlayerTarget] }),
    ];

    let normalizedText = cleanText;
    if (!normalizedText.endsWith(".")) normalizedText += ".";
    normalizedText = normalizedText.replace(/\*\*Support\*\*/g, "Support");

    return AbilityBuilder.static(normalizedText).setEffects(effects).build();
  }

  // Support with description pattern
  const supportDescMatch = cleanText.includes(
    "gains **Support** this turn. _(Whenever they quest",
  );
  if (supportDescMatch) {
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
      supportAbility,
    } = require("~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility");

    const effects = [
      gainsAbilityEffect({
        ability: supportAbility,
        duration: FOR_THE_REST_OF_THIS_TURN,
      }),
    ];

    let normalizedText = cleanText;
    normalizedText = normalizedText.replace(/\*\*Support\*\*/g, "Support");

    return AbilityBuilder.static(normalizedText)
      .setTargets([chosenCharacterTarget])
      .setEffects(effects)
      .build();
  }

  return null;
}
