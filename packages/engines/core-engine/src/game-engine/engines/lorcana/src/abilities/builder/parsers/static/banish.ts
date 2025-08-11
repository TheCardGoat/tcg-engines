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

  return null;
}
