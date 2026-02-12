import type { ItemCard } from "@tcg/lorcana-types";

export const recoveredPage: ItemCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        source: "deck",
        target: "CONTROLLER",
        type: "look-at-cards",
      },
      id: "1xi-1",
      name: "WHAT IS TO COME",
      text: "WHAT IS TO COME When you play this item, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      cost: {
        banishSelf: true,
        ink: 0,
      },
      effect: {
        source: "top-of-deck",
        type: "put-under",
        under: {
          count: 1,
          filter: [
            { owner: "you", type: "owner" },
            { keyword: "Boost", type: "has-keyword" },
          ],
          selector: "chosen",
        },
      },
      id: "1xi-2",
      name: "WHISPERED POWER",
      text: "WHISPERED POWER {d} {I}, Banish this item — Put the top card of your deck facedown under one of your characters or locations with Boost.",
      type: "activated",
    },
  ],
  cardNumber: 30,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "f91a3a07c482663d66dd0687ea10a6afc04a9f4e",
  },
  franchise: "Lorcana",
  id: "1xi",
  inkType: ["amber"],
  inkable: true,
  name: "Recovered Page",
  set: "010",
  text: "WHAT IS TO COME When you play this item, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.\nWHISPERED POWER 1 {I}, Banish this item — Put the top card of your deck facedown under one of your characters or locations with Boost.",
};
