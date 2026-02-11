import type { ItemCard } from "@tcg/lorcana-types";

export const recordPlayer: ItemCard = {
  abilities: [
    {
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
      id: "1nm-1",
      name: "LOOK AT THIS!",
      text: "LOOK AT THIS! Whenever you play a song, chosen character gets -2 {S} until the start of your next turn.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
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
