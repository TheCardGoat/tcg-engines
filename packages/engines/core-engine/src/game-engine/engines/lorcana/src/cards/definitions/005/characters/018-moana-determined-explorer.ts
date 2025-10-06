import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const moanaDeterminedExplorer: LorcanaCharacterCardDefinition = {
  id: "sc1",
  name: "Moana",
  title: "Determined Explorer",
  characteristics: ["hero", "storyborn", "princess"],
  type: "character",
  flavour:
    "Investigate every part of the Illuminary, find the chromicons, restore the Illuminary, how hard can it–wait, what was that noise?",
  colors: ["amber"],
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 2,
  illustrator: "Isabella Ceravolo",
  number: 18,
  set: "SSK",
  rarity: "rare",
};
