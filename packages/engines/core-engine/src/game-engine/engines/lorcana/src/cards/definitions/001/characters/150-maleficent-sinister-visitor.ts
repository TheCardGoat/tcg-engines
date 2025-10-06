import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const maleficentSinisterVisitor: LorcanitoCharacterCardDefinition = {
  id: "zkp",

  name: "Maleficent",
  title: "Sinister Visitor",
  characteristics: ["sorcerer", "storyborn", "villain"],
  type: "character",
  flavour:
    "„The princess shall indeed grow in grace and beauty, beloved by all who know her. But before the sun sets on her sixteenth birthday, she shall prick her finger on the spindle of a spinning wheel...",
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  illustrator: "Nicholas Kole",
  number: 150,
  set: "TFC",
  rarity: "common",
};
