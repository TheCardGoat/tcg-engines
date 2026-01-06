import type { CharacterCard } from "@tcg/lorcana-types";

export const madHatterUnrulyEccentric: CharacterCard = {
  id: "11o",
  cardType: "character",
  name: "Mad Hatter",
  version: "Unruly Eccentric",
  fullName: "Mad Hatter - Unruly Eccentric",
  inkType: ["emerald", "ruby"],
  franchise: "Alice in Wonderland",
  set: "007",
  text: "UNBIRTHDAY PRESENT Whenever a damaged character challenges another character, you may draw a card.",
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 94,
  inkable: true,
  externalIds: {
    ravensburger: "87d0afe0cc27daae68ff3640462f927eefae05ef",
  },
  abilities: [
    {
      id: "11o-1",
      type: "triggered",
      name: "UNBIRTHDAY PRESENT",
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "UNBIRTHDAY PRESENT Whenever a damaged character challenges another character, you may draw a card.",
    },
  ],
  classifications: ["Storyborn"],
};
