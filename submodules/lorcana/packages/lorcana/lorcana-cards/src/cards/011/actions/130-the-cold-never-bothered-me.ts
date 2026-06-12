import type { ActionCard } from "@tcg/lorcana-types";
import { theColdNeverBotheredMeI18n } from "./130-the-cold-never-bothered-me.i18n";

export const theColdNeverBotheredMe: ActionCard = {
  id: "bJE",
  canonicalId: "ci_Vdn",
  reprints: ["set11-130"],
  cardType: "action",
  name: "The Cold Never Bothered Me",
  inkType: ["ruby"],
  franchise: "Frozen",
  set: "011",
  cardNumber: 130,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_e3dbc3e8ae3543059ee67af1d144c576",
    tcgPlayer: 677165,
  },
  text: "Look at the top 4 cards of your deck. You may reveal a location card and put it into your hand. Put the rest into your discard. You pay 3 {I} less for the next location you play this turn.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Look at the top 4 cards of your deck. You may reveal a location card and put it into your hand. Put the rest into your discard. You pay 3 {I} less for the next location you play this turn.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "scry",
            amount: 4,
            target: "CONTROLLER",
            destinations: [
              {
                zone: "hand",
                max: 1,
                reveal: true,
                filter: {
                  type: "card-type",
                  cardType: "location",
                },
              },
              {
                zone: "discard",
                remainder: true,
              },
            ],
          },
          {
            type: "cost-reduction",
            amount: 3,
            cardType: "location",
            duration: "next-play-this-turn",
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: theColdNeverBotheredMeI18n,
};
