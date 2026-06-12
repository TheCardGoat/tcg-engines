import type { ActionCard } from "@tcg/lorcana-types";
import { itMeansNoWorriesI18n } from "./042-it-means-no-worries.i18n";

export const itMeansNoWorries: ActionCard = {
  id: "VR5",
  canonicalId: "ci_Mgx",
  reprints: ["set8-042"],
  cardType: "action",
  name: "It Means No Worries",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "008",
  cardNumber: 42,
  rarity: "rare",
  cost: 9,
  inkable: false,
  externalIds: {
    lorcast: "crd_a288e4ad2fa24cadada391a6d1896d9c",
    tcgPlayer: 631992,
  },
  text: [
    {
      title: "Sing Together 9",
      description:
        "(Any number of your or your teammates' characters with total cost 9 or more may {E} to sing this song for free.)",
    },
    {
      title:
        "Return up to 3 character cards from your discard to your hand. You pay 2 {I} less for the next character you play this turn.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        steps: [
          {
            type: "return-from-discard",
            cardType: "character",
            target: "CONTROLLER",
            count: 3,
          },
          {
            type: "cost-reduction",
            amount: 2,
            cardType: "character",
            duration: "next-play-this-turn",
            target: "CONTROLLER",
          },
        ],
        type: "sequence",
      },
      id: "i3v-1",
      text: "Sing Together 9 Return up to 3 character cards from your discard to your hand. You pay 2 {I} less for the next character you play this turn.",
      type: "action",
    },
  ],
  i18n: itMeansNoWorriesI18n,
};
