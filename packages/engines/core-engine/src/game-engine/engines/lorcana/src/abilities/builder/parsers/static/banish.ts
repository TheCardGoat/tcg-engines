import { AbilityBuilder } from "../../ability-builder";

export function parseBanish(text: string) {
  // Banish all characters/items
  if (/^Banish all characters\.?$/i.test(text)) {
    const {
      banishEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      allCharactersTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    return AbilityBuilder.static("Banish all characters.")
      .setTargets([allCharactersTarget])
      .setEffects([banishEffect()]);
  }
  if (/^Banish all items\.?$/i.test(text)) {
    const {
      banishEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      allItemsTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    return AbilityBuilder.static("Banish all items.")
      .setTargets([allItemsTarget])
      .setEffects([banishEffect()]);
  }

  // Banish chosen variants
  if (/^Banish chosen character\.?$/i.test(text)) {
    const {
      banishEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    return AbilityBuilder.static("Banish chosen character.")
      .setTargets([chosenCharacterTarget])
      .setEffects([banishEffect()]);
  }
  if (/^Banish chosen character with 2 \{S\} or less\.?$/i.test(text)) {
    const {
      banishEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterWithTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    return AbilityBuilder.static("Banish chosen character with 2 {S} or less.")
      .setTargets([
        chosenCharacterWithTarget({
          attribute: "strength",
          comparison: "lte",
          value: 2,
        }),
      ])
      .setEffects([banishEffect()]);
  }
  if (/^Banish chosen character with 5 \{S\} or more\.?$/i.test(text)) {
    const {
      banishEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterWithTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    return AbilityBuilder.static("Banish chosen character with 5 {S} or more.")
      .setTargets([
        chosenCharacterWithTarget({
          attribute: "strength",
          comparison: "gte",
          value: 5,
        }),
      ])
      .setEffects([banishEffect()]);
  }
  if (/^Banish chosen item\.?$/i.test(text)) {
    const {
      banishEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenItemTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    return AbilityBuilder.static("Banish chosen item.")
      .setTargets([chosenItemTarget])
      .setEffects([banishEffect()]);
  }
  if (/^Banish chosen location or item\.?$/i.test(text)) {
    const {
      banishEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenItemOrLocationTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    return AbilityBuilder.static("Banish chosen location or item.")
      .setTargets([chosenItemOrLocationTarget])
      .setEffects([banishEffect()]);
  }
  if (/^Banish chosen damaged character\.?$/i.test(text)) {
    const {
      banishEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenDamagedCharacterTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    return AbilityBuilder.static("Banish chosen damaged character.")
      .setTargets([chosenDamagedCharacterTarget])
      .setEffects([banishEffect()]);
  }

  // Banish any number of your items, then draw a card for each item banished this way.
  if (
    /^Banish any number of your items, then draw a card for each item banished this way\.?$/i.test(
      text,
    )
  ) {
    const {
      banishEffect,
      drawCardEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      anyNumberOfYourItems,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const {
      selfPlayerTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/player-target");
    const normalizedText = text.endsWith(".") ? text : `${text}.`;
    return AbilityBuilder.static(normalizedText).setEffects([
      banishEffect({
        targets: [anyNumberOfYourItems],
        followedBy: drawCardEffect({
          targets: [selfPlayerTarget],
          value: { type: "count", previousEffectTargets: true },
        }),
      }),
    ]);
  }

  // Banish chosen character of yours to banish chosen character.
  if (
    /^Banish chosen character of yours to banish chosen character\.?$/i.test(
      text,
    )
  ) {
    const {
      banishEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterOfYoursTarget,
      chosenCharacterTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const normalizedText = text.endsWith(".") ? text : `${text}.`;
    return AbilityBuilder.static(normalizedText).setEffects([
      banishEffect({
        targets: [chosenCharacterOfYoursTarget],
        followedBy: banishEffect({ targets: [chosenCharacterTarget] }),
      }),
    ]);
  }

  // Banish chosen character who was challenged this turn.
  if (/^Banish chosen character who was challenged this turn\.?$/i.test(text)) {
    const {
      banishEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterWhoHasChallengedTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    return AbilityBuilder.static(
      "Banish chosen character who was challenged this turn.",
    )
      .setTargets([chosenCharacterWhoHasChallengedTarget])
      .setEffects([banishEffect()]);
  }

  // Banish chosen character, then return an item card from your discard to your hand.
  if (
    /^Banish chosen character, then return an item card from your discard to your hand\.?$/i.test(
      text,
    )
  ) {
    const {
      banishEffect,
      returnCardEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterTarget,
      chosenItemFromDiscardTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const normalizedText = text.endsWith(".") ? text : `${text}.`;
    return AbilityBuilder.static(normalizedText).setEffects([
      banishEffect({
        targets: [chosenCharacterTarget],
        followedBy: returnCardEffect({
          to: "hand",
          from: "discard",
          targets: [chosenItemFromDiscardTarget],
        }),
      }),
    ]);
  }

  // Banish chosen item of yours to deal 5 damage to chosen character.
  if (
    /^Banish chosen item of yours to deal 5 damage to chosen character\.?$/i.test(
      text,
    )
  ) {
    const {
      banishEffect,
      dealDamageEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenItemTarget,
      chosenCharacterTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const normalizedText = text.endsWith(".") ? text : `${text}.`;
    return AbilityBuilder.static(normalizedText).setEffects([
      banishEffect({
        targets: [chosenItemTarget],
        followedBy: dealDamageEffect({
          targets: [chosenCharacterTarget],
          value: 5,
        }),
      }),
    ]);
  }

  // Banish chosen item. Its owner gains 2 lore.
  if (/^Banish chosen item\. Its owner gains 2 lore\.?$/i.test(text)) {
    const {
      banishEffect,
      gainLoreEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenItemTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const {
      targetOwnerTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/player-target");
    const normalizedText = text.endsWith(".") ? text : `${text}.`;
    return AbilityBuilder.static(normalizedText).setEffects([
      banishEffect({
        targets: [chosenItemTarget],
        followedBy: gainLoreEffect({ targets: [targetOwnerTarget], value: 2 }),
      }),
    ]);
  }

  // Banish chosen Villain of yours to banish chosen character.
  if (
    /^Banish chosen Villain of yours to banish chosen character\.?$/i.test(text)
  ) {
    const {
      banishEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const villainOfYours = {
      type: "card" as const,
      cardType: "character" as const,
      withClassification: "villain",
      owner: "self" as const,
      count: 1,
    };
    const normalizedText = text.endsWith(".") ? text : `${text}.`;
    return AbilityBuilder.static(normalizedText).setEffects([
      banishEffect({
        targets: [villainOfYours],
        followedBy: banishEffect({ targets: [chosenCharacterTarget] }),
      }),
    ]);
  }

  // Banish one of your characters with **Reckless** to banish chosen character with less {S} than that character.
  if (
    /^Banish one of your characters with \*\*Reckless\*\* to banish chosen character with less \{S\} than that character\.?$/i.test(
      text,
    )
  ) {
    const {
      banishEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      yourCharacterWithKeywordTarget,
      chosenCharacterWithLessStrengthThanPreviousTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const normalizedText = text.endsWith(".") ? text : `${text}.`;
    return AbilityBuilder.static(normalizedText).setEffects([
      banishEffect({
        targets: [yourCharacterWithKeywordTarget("reckless")],
        followedBy: banishEffect({
          targets: [chosenCharacterWithLessStrengthThanPreviousTarget()],
        }),
      }),
    ]);
  }

  return null;
}
