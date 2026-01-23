import type { CharacterCard } from "@tcg/lorcana-types";

export const goofySetForAdventure: CharacterCard = {
  id: "1yc",
  cardType: "character",
  name: "Goofy",
  version: "Set for Adventure",
  fullName: "Goofy - Set for Adventure",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "009",
  text: "FAMILY VACATION Once during your turn, whenever this character moves to a location, you may move one of your other characters to that location for free. If you do, draw a card.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 74,
  inkable: true,
  externalIds: {
    ravensburger: "fd7d6aaf571d6191740e9b1c6ad7cbe7a03811f1",
  },
  abilities: [
    {
      id: "1yc-1",
      type: "triggered",
      name: "FAMILY VACATION Once",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "FAMILY VACATION Once during your turn, whenever this character moves to a location, you may move one of your other characters to that location for free. If you do, draw a card.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
