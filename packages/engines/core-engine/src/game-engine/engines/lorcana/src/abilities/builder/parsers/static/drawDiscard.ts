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
  // Each player draws N cards.
  const eachPlayerDrawMatch = text.match(/^Each player draws (\d+) cards\.?$/i);
  if (eachPlayerDrawMatch) {
    const value = Number.parseInt(eachPlayerDrawMatch[1], 10);
    const {
      drawCardEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      selfPlayerTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/player-target");
    const eachOpponentTarget = {
      type: "player" as const,
      value: "opponent" as const,
      targetAll: true,
    };
    const normalizedText = text.endsWith(".") ? text : `${text}.`;
    return AbilityBuilder.static(normalizedText).setEffects([
      drawCardEffect({ targets: [selfPlayerTarget], value }),
      drawCardEffect({ targets: [eachOpponentTarget], value }),
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
  // Each opponent chooses and discards N cards.
  const eachOppDisc = text.match(
    /^Each opponent chooses and discards (\d+) cards?\.?$/i,
  );
  if (eachOppDisc) {
    const value = Number.parseInt(eachOppDisc[1], 10);
    const {
      discardCardEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const eachOpponentTarget = {
      type: "player" as const,
      value: "opponent" as const,
      targetAll: true,
    };
    const normalizedText = text.endsWith(".") ? text : `${text}.`;
    return AbilityBuilder.static(normalizedText).setEffects([
      discardCardEffect({ targets: [eachOpponentTarget], value }),
    ]);
  }

  // Each opponent reveals their hand. Draw a card.
  if (/^Each opponent reveals their hand\. Draw a card\.?$/i.test(text)) {
    const {
      revealEffect,
      drawCardEffect,
    } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");
    const {
      selfPlayerTarget,
    } = require("~/game-engine/engines/lorcana/src/abilities/targets/player-target");
    const eachOpponentTarget = {
      type: "player" as const,
      value: "opponent" as const,
      targetAll: true,
    };
    return AbilityBuilder.static(
      "Each opponent reveals their hand. Draw a card.",
    ).setEffects([
      revealEffect({ targets: [eachOpponentTarget], from: "hand" }),
      drawCardEffect({ targets: [selfPlayerTarget] }),
    ]);
  }

  return null;
}
