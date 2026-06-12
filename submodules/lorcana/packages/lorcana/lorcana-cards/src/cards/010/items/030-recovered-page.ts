import type { ItemCard } from "@tcg/lorcana-types";
import { recoveredPageI18n } from "./030-recovered-page.i18n";

export const recoveredPage: ItemCard = {
  id: "3sY",
  canonicalId: "ci_3sY",
  reprints: ["set10-030"],
  cardType: "item",
  name: "Recovered Page",
  inkType: ["amber"],
  franchise: "Lorcana",
  set: "010",
  cardNumber: 30,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f682ac8152d24a3192669d92bb1f22d0",
    tcgPlayer: 658330,
  },
  text: [
    {
      title: "WHAT IS TO COME",
      description:
        "When you play this item, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
    {
      title: "WHISPERED POWER 1",
      description:
        "{I}, Banish this item — Put the top card of your deck facedown under one of your characters or locations with Boost.",
    },
  ],
  abilities: [
    {
      id: "1xi-1",
      text: "WHAT IS TO COME When you play this item, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      name: "WHAT IS TO COME",
      effect: {
        type: "scry",
        amount: 4,
        destinations: [
          {
            filter: {
              cardType: "character",
              type: "card-type",
            },
            max: 1,
            min: 0,
            zone: "hand",
          },
          {
            ordering: "player-choice",
            remainder: true,
            zone: "deck-bottom",
          },
        ],
        target: "CONTROLLER",
      },
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      id: "1xi-2",
      name: "WHISPERED POWER",
      type: "activated",
      cost: {
        ink: 1,
        banishSelf: true,
      },
      effect: {
        type: "put-under",
        source: "top-of-deck",
        under: {
          cardTypes: ["character", "location"],
          count: 1,
          owner: "you",
          selector: "chosen",
          zones: ["play"],
          filter: [
            {
              keyword: "Boost",
              type: "has-keyword",
            },
          ],
        },
      },
      text: "WHISPERED POWER 1 {I}, Banish this item — Put the top card of your deck facedown under one of your characters or locations with Boost.",
    },
  ],
  i18n: recoveredPageI18n,
};
