import type { ItemCard } from "@tcg/lorcana-types";

export const recoveredPage: ItemCard = {
  abilities: [
    {
      effect: {
        type: "look-at-cards",
        amount: 1,
        source: "deck",
        target: "CONTROLLER",
      },
      id: "1xi-1",
      name: "WHAT IS TO COME",
      text: "WHAT IS TO COME When you play this item, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
    {
      cost: {
        ink: 0,
        banishSelf: true,
      },
      effect: {
        type: "put-under",
        source: "top-of-deck",
        under: {
          selector: "chosen",
          count: 1,
          filter: [
            { type: "owner", owner: "you" },
            { type: "has-keyword", keyword: "Boost" },
          ],
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
