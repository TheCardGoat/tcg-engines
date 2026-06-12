import type { ActionCard } from "@tcg/lorcana-types";
import { bePreparedI18n } from "./128-be-prepared.i18n";

export const bePrepared: ActionCard = {
  id: "4Sx",
  canonicalId: "ci_4Sx",
  reprints: ["set1-128"],
  cardType: "action",
  name: "Be Prepared",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "001",
  cardNumber: 128,
  rarity: "rare",
  cost: 7,
  inkable: false,
  externalIds: {
    lorcast: "crd_a7c6d3aa2de6462f8d205d70a8fcc54f",
    tcgPlayer: 506077,
  },
  text: "Banish all characters.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        target: "ALL_CHARACTERS",
        type: "banish",
      },
    },
  ],
  i18n: bePreparedI18n,
};
