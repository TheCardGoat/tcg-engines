import { exertedCharCantReadyNextTurn } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kingOfHeartsMonarchOfWonderland: LorcanitoCharacterCardDefinition =
  {
    id: "ss4",
    missingTestCase: true,
    name: "King of Hearts",
    title: "Monarch of Wonderland",
    characteristics: ["storyborn", "ally", "king"],
    text: "**PLEASING THE QUEEN** {E} – Chosen exerted character can’t ready at the start of their next turn.",
    type: "character",
    abilities: [
      {
        type: "activated",
        name: "Pleasing The Queen",
        text: "{E} – Chosen exerted character can’t ready at the start of their next turn.",
        costs: [{ type: "exert" }],
        effects: [exertedCharCantReadyNextTurn],
      },
    ],
    flavour: "By order of the king. You heard what she said!",
    inkwell: true,
    colors: ["amethyst"],
    cost: 4,
    strength: 1,
    willpower: 4,
    lore: 1,
    illustrator: "Brittney Hackett",
    number: 57,
    set: "SSK",
    rarity: "uncommon",
  };
