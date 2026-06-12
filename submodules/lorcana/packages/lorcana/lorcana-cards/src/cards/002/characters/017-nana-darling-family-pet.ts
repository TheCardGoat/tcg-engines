import type { CharacterCard } from "@tcg/lorcana-types";
import { nanaDarlingFamilyPetI18n } from "./017-nana-darling-family-pet.i18n";

export const nanaDarlingFamilyPet: CharacterCard = {
  id: "RVI",
  canonicalId: "ci_RVI",
  reprints: ["set2-017"],
  cardType: "character",
  name: "Nana",
  version: "Darling Family Pet",
  inkType: ["amber"],
  franchise: "Peter Pan",
  set: "002",
  cardNumber: 17,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2efc304326314401b518565ccfc8f238",
    tcgPlayer: 527718,
  },
  text: [
    {
      title: "NURSEMAID",
      description:
        "Whenever you play a Floodborn character, you may remove all damage from chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "1ic-1",
      name: "NURSEMAID",
      text: "NURSEMAID Whenever you play a Floodborn character, you may remove all damage from chosen character.",
      type: "triggered",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          classification: "Floodborn",
          controller: "you",
        },
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          amount: "all",
          target: "CHOSEN_CHARACTER",
          type: "remove-damage",
        },
      },
    },
  ],
  i18n: nanaDarlingFamilyPetI18n,
};
