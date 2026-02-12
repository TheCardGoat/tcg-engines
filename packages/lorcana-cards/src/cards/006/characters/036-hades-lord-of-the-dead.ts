import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesLordOfTheDead: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "ox7-1",
      name: "SOUL COLLECTOR",
      text: "SOUL COLLECTOR Whenever one of your other characters is banished during the opponent's turn, gain 2 lore.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 36,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Deity"],
  cost: 6,
  externalIds: {
    ravensburger: "59d2486d57383b48c7dce89671fcb6798edad839",
  },
  franchise: "Hercules",
  fullName: "Hades - Lord of the Dead",
  id: "ox7",
  inkType: ["amethyst"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Hades",
  set: "006",
  strength: 3,
  text: "SOUL COLLECTOR Whenever one of your other characters is banished during the opponent's turn, gain 2 lore.",
  version: "Lord of the Dead",
  willpower: 4,
};
