import type { ItemCard } from "@tcg/lorcana-types";

export const recordPlayer: ItemCard = {
  abilities: [
    {
      effect: {
        modifier: -2,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "1nm-1",
      name: "LOOK AT THIS!",
      text: "LOOK AT THIS! Whenever you play a song, chosen character gets -2 {S} until the start of your next turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 32,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "d6a087b851dcb654bb021e9fe5c60c69ddb6c769",
  },
  franchise: "Lilo and Stitch",
  id: "1nm",
  inkType: ["amber"],
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  name: "Record Player",
  set: "004",
  text: "LOOK AT THIS! Whenever you play a song, chosen character gets -2 {S} until the start of your next turn.\nHIT PARADE Your characters named Stitch count as having +1 cost to sing songs.",
};
