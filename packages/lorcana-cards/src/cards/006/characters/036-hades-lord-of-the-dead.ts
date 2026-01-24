import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesLordOfTheDead: CharacterCard = {
  id: "ox7",
  cardType: "character",
  name: "Hades",
  version: "Lord of the Dead",
  fullName: "Hades - Lord of the Dead",
  inkType: ["amethyst"],
  franchise: "Hercules",
  set: "006",
  text: "SOUL COLLECTOR Whenever one of your other characters is banished during the opponent's turn, gain 2 lore.",
  cost: 6,
  strength: 3,
  willpower: 4,
  lore: 3,
  cardNumber: 36,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "59d2486d57383b48c7dce89671fcb6798edad839",
  },
  abilities: [
    {
      id: "ox7-1",
      type: "triggered",
      name: "SOUL COLLECTOR",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
      text: "SOUL COLLECTOR Whenever one of your other characters is banished during the opponent's turn, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Deity"],
};
