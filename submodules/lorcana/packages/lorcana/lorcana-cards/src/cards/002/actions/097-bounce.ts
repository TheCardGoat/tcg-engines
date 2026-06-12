import type { ActionCard } from "@tcg/lorcana-types";
import { bounceI18n } from "./097-bounce.i18n";

export const bounce: ActionCard = {
  id: "FHZ",
  canonicalId: "ci_FHZ",
  reprints: ["set2-097"],
  cardType: "action",
  name: "Bounce",
  inkType: ["emerald"],
  franchise: "Winnie the Pooh",
  set: "002",
  cardNumber: 97,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_af02f016a89c4174baa02ff8a5355f4e",
    tcgPlayer: 517599,
  },
  text: "Return chosen character of yours to your hand to return another chosen character to their player's hand.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            target: "CHOSEN_CHARACTER_OF_YOURS",
            type: "return-to-hand",
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              type: "return-to-hand",
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
                requireDifferentTargets: true,
              },
            },
          },
        ],
      },
    },
  ],
  i18n: bounceI18n,
};
