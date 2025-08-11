import { AbilityBuilder } from "../../ability-builder";

export function parseDrawDiscard(text: string) {
  // Draw a card.
  if (/^Draw a card\.?$/i.test(text)) {
    const {
      drawCardEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      selfPlayerTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/player-target");
    return AbilityBuilder.static("Draw a card.").setEffects([
      drawCardEffect({ targets: [selfPlayerTarget], value: 1 }),
    ]);
  }
  // Draw 2 cards.
  if (/^Draw 2 cards\.?$/i.test(text)) {
    const {
      drawCardEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      selfPlayerTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/player-target");
    return AbilityBuilder.static("Draw 2 cards.").setEffects([
      drawCardEffect({ targets: [selfPlayerTarget], value: 2 }),
    ]);
  }
  // Draw 3 cards.
  if (/^Draw 3 cards\.?$/i.test(text)) {
    const {
      drawCardEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      selfPlayerTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/player-target");
    return AbilityBuilder.static("Draw 3 cards.").setEffects([
      drawCardEffect({ targets: [selfPlayerTarget], value: 3 }),
    ]);
  }
  // Discard a card.
  if (/^Discard a card\.?$/i.test(text)) {
    const {
      discardCardEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      selfPlayerTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/player-target");
    return AbilityBuilder.static("Discard a card.").setEffects([
      discardCardEffect({ targets: [selfPlayerTarget], value: 1 }),
    ]);
  }
  // Discard 2 cards.
  if (/^Discard 2 cards\.?$/i.test(text)) {
    const {
      discardCardEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      selfPlayerTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/player-target");
    return AbilityBuilder.static("Discard 2 cards.").setEffects([
      discardCardEffect({ targets: [selfPlayerTarget], value: 2 }),
    ]);
  }
  // Discard 3 cards.
  if (/^Discard 3 cards\.?$/i.test(text)) {
    const {
      discardCardEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      selfPlayerTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/player-target");
    return AbilityBuilder.static("Discard 3 cards.").setEffects([
      discardCardEffect({ targets: [selfPlayerTarget], value: 3 }),
    ]);
  }
  return null;
}
