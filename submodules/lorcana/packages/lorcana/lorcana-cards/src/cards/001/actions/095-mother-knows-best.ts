import type { ActionCard } from "@tcg/lorcana-types";
import { motherKnowsBestI18n } from "./095-mother-knows-best.i18n";

export const motherKnowsBest: ActionCard = {
  id: "VGx",
  canonicalId: "ci_12N",
  reprints: ["set1-095", "set9-099"],
  cardType: "action",
  name: "Mother Knows Best",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "001",
  cardNumber: 95,
  rarity: "uncommon",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_39a0e5d019794fcd9a96be1309addb7c",
    tcgPlayer: 650037,
  },
  text: "Return chosen character to their player's hand.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "return-to-hand",
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
  i18n: motherKnowsBestI18n,
};
