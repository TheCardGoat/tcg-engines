import type { ActionCard } from "@tcg/lorcana-types";
import { akoodEtEmutiI18n } from "./029-akood-et-emuti.i18n";

export const akoodEtEmuti: ActionCard = {
  id: "Y3X",
  canonicalId: "ci_Y3X",
  reprints: ["set11-029"],
  cardType: "action",
  name: "Akood et Emuti",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 29,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_ff15d454e2f84f89a64bf17216e0b5f4",
    tcgPlayer: 674689,
  },
  text: "You pay 2 {I} less for the next character you play this turn. Draw a card.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "You pay 2 {I} less for the next character you play this turn. Draw a card.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "cost-reduction",
            amount: 2,
            cardType: "character",
            duration: "next-play-this-turn",
            target: "CONTROLLER",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: akoodEtEmutiI18n,
};
