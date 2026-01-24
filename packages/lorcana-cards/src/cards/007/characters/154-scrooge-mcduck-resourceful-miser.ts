import type { CharacterCard } from "@tcg/lorcana-types";

export const scroogeMcduckResourcefulMiser: CharacterCard = {
  id: "18b",
  cardType: "character",
  name: "Scrooge McDuck",
  version: "Resourceful Miser",
  fullName: "Scrooge McDuck - Resourceful Miser",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "007",
  text: "PUT IT TO GOOD USE You may exert 4 items of yours to play this character for free.\nFORTUNE HUNTER When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  cardNumber: 154,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9fb5d0200a632d4583ec76955bc03c2431cf5651",
  },
  abilities: [
    {
      id: "18b-1",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "exert",
          target: {
            selector: "self",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "PUT IT TO GOOD USE You may exert 4 items of yours to play this character for free.",
    },
    {
      id: "18b-2",
      type: "triggered",
      name: "FORTUNE HUNTER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      text: "FORTUNE HUNTER When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
