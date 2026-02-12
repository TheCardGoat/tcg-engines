import type { CharacterCard } from "@tcg/lorcana-types";

export const madHatterUnrulyEccentric: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "11o-1",
      name: "UNBIRTHDAY PRESENT",
      text: "UNBIRTHDAY PRESENT Whenever a damaged character challenges another character, you may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 94,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 6,
  externalIds: {
    ravensburger: "87d0afe0cc27daae68ff3640462f927eefae05ef",
  },
  franchise: "Alice in Wonderland",
  fullName: "Mad Hatter - Unruly Eccentric",
  id: "11o",
  inkType: ["emerald", "ruby"],
  inkable: true,
  lore: 2,
  name: "Mad Hatter",
  set: "007",
  strength: 3,
  text: "UNBIRTHDAY PRESENT Whenever a damaged character challenges another character, you may draw a card.",
  version: "Unruly Eccentric",
  willpower: 5,
};
