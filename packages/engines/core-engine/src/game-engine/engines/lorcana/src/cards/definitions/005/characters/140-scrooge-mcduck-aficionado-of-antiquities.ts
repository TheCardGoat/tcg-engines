import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const scroogeMcduckAficionadoOfAntiquities: LorcanitoCharacterCardDefinition =
  {
    id: "vq1",
    name: "Scrooge McDuck",
    title: "Afficionado of Antiquities",
    characteristics: ["hero", "storyborn"],
    type: "character",
    flavour:
      "The secret room should be right here! Ach, I cannot believe I paid a whole penny for this map.",
    colors: ["sapphire"],
    cost: 4,
    strength: 5,
    willpower: 5,
    lore: 2,
    illustrator: "Cam Kendell",
    number: 140,
    set: "SSK",
    rarity: "rare",
  };
