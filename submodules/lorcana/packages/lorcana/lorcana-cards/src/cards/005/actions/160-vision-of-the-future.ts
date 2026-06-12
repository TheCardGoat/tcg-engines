import type { ActionCard } from "@tcg/lorcana-types";
import { visionOfTheFutureI18n } from "./160-vision-of-the-future.i18n";

export const visionOfTheFuture: ActionCard = {
  id: "Dub",
  canonicalId: "ci_Dub",
  reprints: ["set5-160"],
  cardType: "action",
  name: "Vision of the Future",
  inkType: ["sapphire"],
  franchise: "Sword in the Stone",
  set: "005",
  cardNumber: 160,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_69128022cf3e4ff7bdd615ab371405a7",
    tcgPlayer: 561652,
  },
  text: "Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order.",
  abilities: [
    {
      effect: {
        amount: 5,
        destinations: [
          {
            zone: "hand",
            min: 1,
            max: 1,
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
        target: "CONTROLLER",
        type: "scry",
      },
      id: "xym-1",
      text: "Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order.",
      type: "action",
    },
  ],
  i18n: visionOfTheFutureI18n,
};
