import { AbilityBuilder } from "../../ability-builder";

export function parseMoveReady(text: string) {
  // Ready chosen character.
  if (/^Ready chosen character\.?$/i.test(text)) {
    const {
      chosenCharacterTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const normalizedText = text.endsWith(".") ? text : text + ".";
    return AbilityBuilder.static(normalizedText)
      .setTargets([chosenCharacterTarget])
      .setEffects([{ type: "ready", targets: [chosenCharacterTarget] }]);
  }

  // Ready all your characters.
  if (/^Ready all your characters\.?$/i.test(text)) {
    const {
      yourCharactersTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const normalizedText = text.endsWith(".") ? text : `${text}.`;
    return AbilityBuilder.static(normalizedText)
      .setTargets([yourCharactersTarget])
      .setEffects([{ type: "ready", targets: [yourCharactersTarget] }]);
  }

  // Ready chosen character. They can't quest for the rest of this turn.
  if (
    /^Ready chosen character\. They can't quest for the rest of this turn\.?$/i.test(
      text,
    )
  ) {
    const {
      restrictEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const {
      FOR_THE_REST_OF_THIS_TURN,
    } = require("~/game-engine/engines/lorcana/src/abilities/duration");
    const normalizedText = text.endsWith(".") ? text : text + ".";
    return AbilityBuilder.static(normalizedText)
      .setTargets([chosenCharacterTarget])
      .setEffects([
        { type: "ready", targets: [chosenCharacterTarget] },
        restrictEffect({
          restriction: "quest",
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
      ]);
  }

  // Ready all your characters. They can't quest for the rest of this turn.
  if (
    /^Ready all your characters\. They can't quest for the rest of this turn\.?$/i.test(
      text,
    )
  ) {
    const {
      restrictEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      yourCharactersTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const {
      FOR_THE_REST_OF_THIS_TURN,
    } = require("~/game-engine/engines/lorcana/src/abilities/duration");
    const normalizedText = text.endsWith(".") ? text : text + ".";
    return AbilityBuilder.static(normalizedText)
      .setTargets([yourCharactersTarget])
      .setEffects([
        { type: "ready", targets: [yourCharactersTarget] },
        restrictEffect({
          targets: [yourCharactersTarget],
          restriction: "quest",
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
      ]);
  }

  // Ready all your characters. For the rest of this turn, they take no damage from challenges and can't quest.
  if (
    /^Ready all your characters\. For the rest of this turn, they take no damage from challenges and can't quest\.?$/i.test(
      text,
    )
  ) {
    const {
      damageImmunityEffect,
      restrictEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      yourCharactersTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const {
      FOR_THE_REST_OF_THIS_TURN,
    } = require("~/game-engine/engines/lorcana/src/abilities/duration");
    const normalizedText = text.endsWith(".") ? text : text + ".";
    return AbilityBuilder.static(normalizedText)
      .setTargets([yourCharactersTarget])
      .setEffects([
        { type: "ready", targets: [yourCharactersTarget] },
        restrictEffect({
          targets: [yourCharactersTarget],
          restriction: "quest",
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
        damageImmunityEffect({
          targets: [yourCharactersTarget],
          sources: ["challenges"],
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
      ]);
  }

  // Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.
  if (
    /^Ready all your characters and deal 1 damage to each of them\. They can't quest for the rest of this turn\.?$/i.test(
      text,
    )
  ) {
    const {
      dealDamageEffect,
      restrictEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      yourCharactersTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const {
      FOR_THE_REST_OF_THIS_TURN,
    } = require("~/game-engine/engines/lorcana/src/abilities/duration");
    const normalizedText = text.endsWith(".") ? text : text + ".";
    return AbilityBuilder.static(normalizedText)
      .setTargets([yourCharactersTarget])
      .setEffects([
        { type: "ready", targets: [yourCharactersTarget] },
        dealDamageEffect({ targets: [yourCharactersTarget], value: 1 }),
        restrictEffect({
          targets: [yourCharactersTarget],
          restriction: "quest",
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
      ]);
  }

  return null;
}
