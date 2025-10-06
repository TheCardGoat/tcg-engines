import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/target";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const minnieMouseQuickthinkingInventor: LorcanitoCharacterCardDefinition =
  {
    id: "zsf",
    missingTestCase: true,
    name: "Minnie Mouse",
    title: "Quick-Thinking Inventor",
    characteristics: ["hero", "dreamborn", "inventor"],
    text: "**CAKE CATAPULT** When you play this character, chosen character gets -2 {S} this turn.",
    type: "character",
    abilities: [
      {
        type: "resolution",
        name: "CAKE CATAPULT",
        text: "When you play this character, chosen character gets -2 {S} this turn.",
        effects: [
          {
            type: "attribute",
            attribute: "strength",
            amount: 2,
            modifier: "subtract",
            target: chosenCharacter,
          },
        ],
      },
    ],
    flavour: "This puts the Frosting Flinger 2000 to shame.",
    colors: ["sapphire"],
    cost: 1,
    strength: 1,
    willpower: 2,
    lore: 1,
    illustrator: "Lauren Levering",
    number: 152,
    set: "SSK",
    rarity: "common",
  };
