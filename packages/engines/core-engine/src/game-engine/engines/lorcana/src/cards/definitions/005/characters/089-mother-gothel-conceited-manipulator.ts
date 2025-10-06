import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const motherGothelConceitedManipulator: LorcanaCharacterCardDefinition =
  {
    id: "frm",
    name: "Mother Gothel",
    title: "Conceited Manipulator",
    characteristics: ["storyborn", "villain"],
    text: "**MOTHER KNOWS BEST** When you play this character, you may pay 3 {I} to return chosen character to their player’s hand.",
    type: "character",
    abilities: [
      {
        type: "resolution",
        name: "MOTHER KNOWS BEST",
        text: "When you play this character, you may pay 3 {I} to return chosen character to their player’s hand.",
        costs: [{ type: "ink", amount: 3 }],
        optional: true,
        effects: [
          {
            type: "move",
            to: "hand",
            target: chosenCharacter,
          },
        ],
      },
    ],
    flavour: "A beautiful lady never stands meekly at the back of the line.",
    inkwell: true,
    colors: ["emerald"],
    cost: 2,
    strength: 1,
    willpower: 3,
    lore: 1,
    illustrator: "Carlos Gomes Cabral",
    number: 89,
    set: "SSK",
    rarity: "uncommon",
  };
