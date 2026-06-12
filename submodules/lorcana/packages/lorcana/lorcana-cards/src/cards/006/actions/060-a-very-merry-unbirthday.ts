import type { ActionCard } from "@tcg/lorcana-types";
import { aVeryMerryUnbirthdayI18n } from "./060-a-very-merry-unbirthday.i18n";

export const aVeryMerryUnbirthday: ActionCard = {
  id: "Nv8",
  canonicalId: "ci_Nv8",
  reprints: ["set6-060"],
  cardType: "action",
  name: "A Very Merry Unbirthday",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "006",
  cardNumber: 60,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6b0de2d0a5b84b5f852ba2a8eccd1a17",
    tcgPlayer: 591114,
  },
  text: "Each opponent puts the top 2 cards of their deck into their discard.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Each opponent puts the top 2 cards of their deck into their discard.",
      effect: {
        type: "mill",
        amount: 2,
        target: "EACH_OPPONENT",
      },
    },
  ],
  i18n: aVeryMerryUnbirthdayI18n,
};
