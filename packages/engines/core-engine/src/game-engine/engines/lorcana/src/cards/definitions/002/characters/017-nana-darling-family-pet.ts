import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverYouPlayAFloodBorn } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const nanaDarlingFamilyPet: LorcanaCharacterCardDefinition = {
  id: "v76",
  name: "Nana",
  title: "Darling Family Pet",
  characteristics: ["storyborn", "ally"],
  text: "**NURSEMAID** Whenever you play a Floodborn character, you may remove all damage from chosen character.",
  type: "character",
  abilities: [
    wheneverYouPlayAFloodBorn({
      name: "Nursemaid",
      text: "Whenever you play a Floodborn character, you may remove all damage from chosen character.",
      optional: true,
      effects: [
        {
          type: "heal",
          amount: 99,
          target: chosenCharacter,
        },
      ],
    }),
  ],
  flavour: "Children are a dog's best friend.",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Filipe Laurentino",
  number: 17,
  set: "ROF",
  rarity: "uncommon",
};
