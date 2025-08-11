import { AbilityBuilder } from "../../ability-builder";

export function parseRestrict(text: string) {
  // Chosen character can challenge ready characters this turn.
  if (
    /^Chosen character can challenge ready characters this turn\.?$/i.test(text)
  ) {
    const {
      challengeOverrideEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      THIS_TURN,
    } = require("~/game-engine/engines/lorcana/src/abilities/duration");
    const {
      chosenCharacterTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const normalizedText = text.endsWith(".") ? text : text + ".";
    return AbilityBuilder.static(normalizedText)
      .setTargets([chosenCharacterTarget])
      .setEffects([
        challengeOverrideEffect({ canChallenge: "ready", duration: THIS_TURN }),
      ]);
  }

  // Chosen character can't challenge during their next turn. Draw a card.
  if (
    /^Chosen character can't challenge during their next turn\. Draw a card\.?$/i.test(
      text,
    )
  ) {
    const {
      restrictEffect,
      drawCardEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      DURING_THEIR_NEXT_TURN,
    } = require("~/game-engine/engines/lorcana/src/abilities/duration");
    const {
      chosenCharacterTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const {
      selfPlayerTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/player-target");
    const normalizedText = text.endsWith(".") ? text : `${text}.`;
    return AbilityBuilder.static(normalizedText).setEffects([
      restrictEffect({
        targets: [chosenCharacterTarget],
        restriction: "challenge",
        duration: DURING_THEIR_NEXT_TURN,
      }),
      drawCardEffect({ targets: [selfPlayerTarget] }),
    ]);
  }

  // Chosen exerted character can't ready at the start of their next turn.
  if (
    /^Chosen exerted character can't ready at the start of their next turn\.?$/i.test(
      text,
    )
  ) {
    const {
      restrictEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      DURING_THEIR_NEXT_TURN,
    } = require("~/game-engine/engines/lorcana/src/abilities/duration");
    const {
      chosenExertedCharacterTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const normalizedText = text.endsWith(".") ? text : text + ".";
    return AbilityBuilder.static(normalizedText)
      .setTargets([chosenExertedCharacterTarget])
      .setEffects([
        restrictEffect({
          targets: [chosenExertedCharacterTarget],
          restriction: "ready",
          duration: DURING_THEIR_NEXT_TURN,
        }),
      ]);
  }

  // Chosen character of yours can't be challenged until the start of your next turn.
  if (
    /^Chosen character of yours can't be challenged until the start of your next turn\.?$/i.test(
      text,
    )
  ) {
    const {
      restrictEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterOfYoursTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const {
      UNTIL_START_OF_YOUR_NEXT_TURN,
    } = require("~/game-engine/engines/lorcana/src/abilities/duration");
    const normalizedText = text.endsWith(".") ? text : text + ".";
    return AbilityBuilder.static(normalizedText)
      .setTargets([chosenCharacterOfYoursTarget])
      .setEffects([
        restrictEffect({
          targets: [chosenCharacterOfYoursTarget],
          restriction: "challengeable",
          duration: UNTIL_START_OF_YOUR_NEXT_TURN,
        }),
      ]);
  }

  return null;
}
