import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mulanArmoredFighter: LorcanitoCharacterCardDefinition = {
  id: "v1e",
  name: "Mulan",
  title: "Armored Fighter",
  characteristics: ["hero", "storyborn", "princess"],
  type: "character",
  flavour:
    "Maybe what I really wanted was to prove I could do things right, so when I looked in the mirror, I'd see someone worthwhile.",
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  strength: 3,
  willpower: 6,
  lore: 1,
  illustrator: "Amber Kommavongsa",
  number: 189,
  set: "URR",
  rarity: "uncommon",
};
