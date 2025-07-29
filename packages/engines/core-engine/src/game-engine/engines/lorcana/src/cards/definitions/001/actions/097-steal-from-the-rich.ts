import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const stealFromRich: LorcanaActionCardDefinition = {
  id: "wje",
  notImplemented: true,
  name: "Steal from the Rich",
  characteristics: ["action"],
  text: "Whenever one of your characters quests this turn, each opponent loses 1 lore.",
  type: "action",
  abilities: [],
  flavour:
    "Wonder how much ol' Prince John spent on all those fancy locks. \n−Little John",
  colors: ["emerald"],
  cost: 5,
  illustrator: "Hedvig Häggman-Sund",
  number: 97,
  set: "TFC",
  rarity: "rare",
};
