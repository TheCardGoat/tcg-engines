import type { CharacterCard } from "@tcg/lorcana-types";

export const beastHardheaded: CharacterCard = {
  id: "m8v",
  cardType: "character",
  name: "Beast",
  version: "Hardheaded",
  fullName: "Beast - Hardheaded",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "001",
  text: "BREAK When you play this character, you may banish chosen item.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 172,
  inkable: true,
  externalIds: {
    ravensburger: "502da9f4533484bfe02fb51fd83498e2d63e3275",
  },
  abilities: [
    {
      id: "m8v-1",
      text: "BREAK When you play this character, you may banish chosen item.",
      name: "BREAK",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
