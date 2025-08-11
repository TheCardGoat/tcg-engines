import { AbilityBuilder } from "../../ability-builder";

// Draw 2 cards, then choose and discard N cards (supports "a card" as N=1)
export function parseDrawThenDiscard(text: string) {
  const m = text.match(
    /^Draw\s*(\d+)\s*cards,\s*then\s*choose\s*and\s*discard\s*(\d+|a)\s*cards?\.?$/i,
  );
  if (!m) return null;
  const draw = Number.parseInt(m[1], 10);
  const discard = m[2].toLowerCase() === "a" ? 1 : Number.parseInt(m[2], 10);

  const {
    drawThenDiscardEffect,
  } = require("~/game-engine/engines/lorcana/src/abilities/effect/effect");

  const normalizedText = text.endsWith(".") ? text : `${text}.`;
  return AbilityBuilder.static(normalizedText)
    .setEffects(drawThenDiscardEffect({ draw, discard }))
    .build();
}
