import { AbilityBuilder } from "../../ability-builder";

export function parseReturnPut(text: string) {
  // Return chosen character to their player's hand.
  if (/^Return chosen character to their player's hand\.?$/i.test(text)) {
    const {
      chosenCharacterTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const {
      returnCardEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    return AbilityBuilder.static(
      "Return chosen character to their player's hand.",
    )
      .setTargets([chosenCharacterTarget])
      .setEffects([returnCardEffect({ to: "hand", from: "play" })]);
  }

  // Return a character card from your discard to your hand.
  if (
    /^Return a character card from your discard to your hand\.?$/i.test(text)
  ) {
    const {
      returnCardEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterFromDiscardTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const normalizedText = text.endsWith(".") ? text : `${text}.`;
    return AbilityBuilder.static(normalizedText)
      .setTargets([chosenCharacterFromDiscardTarget])
      .setEffects([returnCardEffect({ to: "hand", from: "discard" })]);
  }

  // Return an item card from your discard to your hand.
  if (/^Return an item card from your discard to your hand\.?$/i.test(text)) {
    const {
      returnCardEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenItemFromDiscardTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const normalizedText = text.endsWith(".") ? text : `${text}.`;
    return AbilityBuilder.static(normalizedText)
      .setTargets([chosenItemFromDiscardTarget])
      .setEffects([returnCardEffect({ to: "hand", from: "discard" })]);
  }

  // Return chosen damaged character to their player's hand.
  if (
    /^Return chosen damaged character to their player's hand\.?$/i.test(text)
  ) {
    const {
      chosenDamagedCharacterTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const {
      returnCardEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const normalizedText = text.endsWith(".") ? text : `${text}.`;
    return AbilityBuilder.static(normalizedText)
      .setTargets([chosenDamagedCharacterTarget])
      .setEffects([returnCardEffect({ to: "hand", from: "play" })]);
  }

  // Return up to 2 item cards from your discard into your hand.
  if (
    /^Return up to 2 item cards from your discard into your hand\.?$/i.test(
      text,
    )
  ) {
    const {
      returnCardEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const upTo2Items = {
      type: "card" as const,
      cardType: "item" as const,
      zone: "discard" as const,
      min: 0,
      max: 2,
    };
    const normalizedText = text.endsWith(".") ? text : `${text}.`;
    return AbilityBuilder.static(normalizedText).setEffects([
      returnCardEffect({ to: "hand", from: "discard", targets: [upTo2Items] }),
    ]);
  }

  // Return a character card with cost 2 or less from your discard to your hand.
  if (
    /^Return a character card with cost 2 or less from your discard to your hand\.?$/i.test(
      text,
    )
  ) {
    const {
      returnCardEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterWithCost2OrLessFromDiscardTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const normalizedText = text.endsWith(".") ? text : `${text}.`;
    return AbilityBuilder.static(normalizedText)
      .setTargets([chosenCharacterWithCost2OrLessFromDiscardTarget])
      .setEffects([returnCardEffect({ to: "hand", from: "discard" })]);
  }

  // Return a character or item with cost 2 or less to their player's hand.
  if (
    /^Return a character or item with cost 2 or less to their player's hand\.?$/i.test(
      text,
    )
  ) {
    const {
      returnCardEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterOrItemWithCost2OrLessTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const normalizedText = text.endsWith(".") ? text : `${text}.`;
    return AbilityBuilder.static(normalizedText)
      .setTargets([chosenCharacterOrItemWithCost2OrLessTarget])
      .setEffects([returnCardEffect({ to: "hand", from: "play" })]);
  }

  // Return a character, item or location with cost 2 or less to their player's hand.
  if (
    /^Return a character, item or location with cost 2 or less to their player's hand\.?$/i.test(
      text,
    )
  ) {
    const {
      returnCardEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      chosenCharacterItemOrLocationWithCost2OrLessTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/card-target");
    const normalizedText = text.endsWith(".") ? text : `${text}.`;
    return AbilityBuilder.static(normalizedText)
      .setTargets([chosenCharacterItemOrLocationWithCost2OrLessTarget])
      .setEffects([returnCardEffect({ to: "hand", from: "play" })]);
  }

  return null;
}
