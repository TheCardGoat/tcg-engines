import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMouseTrueFriend: LorcanitoCharacterCardDefinition = {
  id: "dr0",
  reprints: ["c2m"],
  name: "Mickey Mouse",
  title: "True Friend",
  characteristics: ["hero", "storyborn"],
  type: "character",
  flavour:
    "As long as he's around, newcomers to the Great Illuminary will always get a warm welcome.",
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Dave Beauchene",
  number: 12,
  set: "TFC",
  rarity: "uncommon",
};
