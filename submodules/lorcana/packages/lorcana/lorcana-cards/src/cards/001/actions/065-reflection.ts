import type { ActionCard } from "@tcg/lorcana-types";
import { reflectionI18n } from "./065-reflection.i18n";

export const reflection: ActionCard = {
  id: "wVZ",
  canonicalId: "ci_wVZ",
  reprints: ["set1-065"],
  cardType: "action",
  name: "Reflection",
  inkType: ["amethyst"],
  franchise: "Mulan",
  set: "001",
  cardNumber: 65,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2edd696f67314cde96ae6ff8f6661033",
    tcgPlayer: 506113,
  },
  text: "Look at the top 3 cards of your deck. Put them back on the top of your deck in any order.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "scry",
        amount: 3,
        destinations: [
          {
            ordering: "player-choice",
            remainder: true,
            zone: "deck-top",
          },
        ],
      },
    },
  ],
  i18n: reflectionI18n,
};
