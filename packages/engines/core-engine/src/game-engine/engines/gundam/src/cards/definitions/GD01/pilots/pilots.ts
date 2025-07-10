import { drawXCard } from "~/game-engine/engines/gundam/src/abilities/effects/effects";
import type { GundamitoPilotCard } from "../../cardTypes";

export const banagherLinks: GundamitoPilotCard = {
  id: "GD01-088",
  implemented: true,
  cost: 1,
  level: 5,
  name: "Banagher Links",
  type: "pilot",
  abilities: [
    {
      type: "when-paired",
      name: "Banagher Links's 'when-paired' ability",
      text: "If this is a Link Unit, draw 1.",
      conditions: [{ type: "during-pair", onlyLinked: true }],
      effects: [drawXCard(1)],
    },
  ],
  traits: ["civilian"],
  rarity: "rare",
  color: "blue",
  number: 88,
  set: "GD01",
  apModifier: 2,
  hpModifier: 2,
};
