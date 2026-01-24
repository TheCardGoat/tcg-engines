import type { ItemCard } from "@tcg/lorcana-types";

export const recordPlayer: ItemCard = {
  id: "1nm",
  cardType: "item",
  name: "Record Player",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "004",
  text: "LOOK AT THIS! Whenever you play a song, chosen character gets -2 {S} until the start of your next turn.\nHIT PARADE Your characters named Stitch count as having +1 cost to sing songs.",
  cost: 2,
  cardNumber: 32,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d6a087b851dcb654bb021e9fe5c60c69ddb6c769",
  },
  abilities: [
    {
      id: "1nm-1",
      type: "triggered",
      name: "LOOK AT THIS!",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "LOOK AT THIS! Whenever you play a song, chosen character gets -2 {S} until the start of your next turn.",
    },
  ],
};
