import type { ActionCard } from "@tcg/lorcana-types";
import { brunosReturnI18n } from "./029-brunos-return.i18n";

export const brunosReturn: ActionCard = {
  id: "n0F",
  canonicalId: "ci_RJP",
  slug: "lorcana-ci_RJP",
  printings: [
    {
      id: "set9-029",
      artId: "set9-029",
      setCode: "set9",
      collectorNumber: "29",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set4-026", "set9-029"],
  cardType: "action",
  name: "Bruno's Return",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "009",
  cardNumber: 29,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_abc3f1da50d04f768b1181878b17f8da",
    tcgPlayer: "649976",
  },
  text: "Return a character card from your discard to your hand. You may remove up to 2 damage from chosen character.",
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
