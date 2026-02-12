import type { CharacterCard } from "@tcg/lorcana-types";

export const goofySetForAdventure: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      id: "1yc-1",
      name: "FAMILY VACATION Once",
      text: "FAMILY VACATION Once during your turn, whenever this character moves to a location, you may move one of your other characters to that location for free. If you do, draw a card.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 74,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "fd7d6aaf571d6191740e9b1c6ad7cbe7a03811f1",
  },
  franchise: "Goofy Movie",
  fullName: "Goofy - Set for Adventure",
  id: "1yc",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  name: "Goofy",
  set: "009",
  strength: 2,
  text: "FAMILY VACATION Once during your turn, whenever this character moves to a location, you may move one of your other characters to that location for free. If you do, draw a card.",
  version: "Set for Adventure",
  willpower: 2,
};
