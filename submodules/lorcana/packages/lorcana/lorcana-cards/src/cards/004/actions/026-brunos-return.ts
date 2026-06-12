import type { ActionCard } from "@tcg/lorcana-types";
import { brunosReturnI18n } from "./026-brunos-return.i18n";

export const brunosReturn: ActionCard = {
  id: "yxb",
  canonicalId: "ci_RJP",
  reprints: ["set4-026", "set9-029"],
  cardType: "action",
  name: "Bruno's Return",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "004",
  cardNumber: 26,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_abc3f1da50d04f768b1181878b17f8da",
    tcgPlayer: 649976,
  },
  text: "Return a character card from your discard to your hand. Then remove up to 2 damage from chosen character.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "return-to-hand",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["discard"],
              cardTypes: ["character"],
            },
          },
          {
            type: "remove-damage",
            amount: 2,
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        ],
      },
    },
  ],
  i18n: brunosReturnI18n,
};
