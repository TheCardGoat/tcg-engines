import type { CharacterCard } from "@tcg/lorcana-types";

export const scroogeMcduckResourcefulMiser: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
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
        type: "optional",
      },
      id: "18b-1",
      text: "PUT IT TO GOOD USE You may exert 4 items of yours to play this character for free.",
      type: "action",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        type: "optional",
      },
      id: "18b-2",
      name: "FORTUNE HUNTER",
      text: "FORTUNE HUNTER When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 154,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "9fb5d0200a632d4583ec76955bc03c2431cf5651",
  },
  franchise: "Ducktales",
  fullName: "Scrooge McDuck - Resourceful Miser",
  id: "18b",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Scrooge McDuck",
  set: "007",
  strength: 4,
  text: "PUT IT TO GOOD USE You may exert 4 items of yours to play this character for free.\nFORTUNE HUNTER When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  version: "Resourceful Miser",
  willpower: 4,
};
