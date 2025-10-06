import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sirEctorCastleLord: LorcanaCharacterCardDefinition = {
  id: "q1j",
  name: "Sir Ector",
  title: "Castle Lord",
  characteristics: ["storyborn", "knight"],
  type: "character",
  flavour:
    "Well, by Jove. Don't just stand there. Raise a glass to my son Kay... and may we be rid of the trickster wizard Marvin, or whatever his blasted name was.",
  colors: ["steel"],
  cost: 7,
  strength: 7,
  willpower: 10,
  lore: 3,
  illustrator: "Brian Weisz",
  number: 188,
  set: "SSK",
  rarity: "rare",
};
