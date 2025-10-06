import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const goofyKnightForADay: LorcanitoCharacterCardDefinition = {
  id: "u0j",
  name: "Goofy",
  title: "Knight for a Day",
  characteristics: ["hero", "dreamborn", "knight"],
  type: "character",
  flavour:
    "It's a banner day for Sir Goofy, who is steeled to prove his mettle against anyone courting trouble−joust in case.",
  inkwell: true,
  colors: ["steel"],
  cost: 9,
  strength: 10,
  willpower: 10,
  lore: 4,
  illustrator: "Marco Giorgianni",
  number: 180,
  set: "ROF",
  rarity: "rare",
};
