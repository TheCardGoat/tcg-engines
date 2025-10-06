import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const plutoRescueDog: LorcanitoCharacterCardDefinition = {
  id: "rrk",
  reprints: ["baa"],
  missingTestCase: true,
  name: "Pluto",
  title: "Rescue Dog",
  characteristics: ["storyborn", "ally"],
  text: "**TO THE RESCUE** When you play this character, you may remove up to 3 damage from chosen character.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "TO THE RESCUE",
      text: "When you play this character, you may remove up to 3 damage from chosen character.",
      effects: [
        {
          type: "heal",
          amount: 3,
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "When you need help, it's his face you want to see first.",
  inkwell: true,
  colors: ["amber"],
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  illustrator: "Kenneth Anderson",
  number: 20,
  set: "URR",
  rarity: "common",
};
