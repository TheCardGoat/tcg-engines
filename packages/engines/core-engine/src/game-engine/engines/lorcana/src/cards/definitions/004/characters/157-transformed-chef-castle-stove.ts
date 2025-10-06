import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const transformedChefCastleStove: LorcanaCharacterCardDefinition = {
  id: "szw",
  missingTestCase: true,
  name: "Transformed Chef",
  title: "Castle Stove",
  characteristics: ["storyborn", "ally"],
  text: "**SMOOTH SMALL DISHES** When you play this character, remove up to 2 damage from chosen character.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "SMOOTH SMALL DISHES",
      text: "When you play this character, remove up to 2 damage from chosen character.",
      effects: [
        {
          type: "heal",
          amount: 2,
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "A good hot meal will put you back on your feet.\n−Madame Samovar",
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "James C Mulligan",
  number: 157,
  set: "URR",
  rarity: "common",
};
