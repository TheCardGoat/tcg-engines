import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const vanellopeVonSchweetzSugarRushChamp: LorcanitoCharacterCardDefinition =
  {
    id: "huy",
    name: "Vanellope von Schweetz",
    title: "Sugar Rush Champ",
    characteristics: ["hero", "storyborn", "princess", "racer"],
    type: "character",
    flavour:
      "Look, the code may say I'm a princess, but I know who I really am....",
    inkwell: true,
    colors: ["amber"],
    cost: 1,
    strength: 2,
    willpower: 2,
    lore: 1,
    illustrator: "César Vergara / Eri Welli",
    number: 6,
    set: "SSK",
    rarity: "common",
  };
