import type { ActionCard } from "@tcg/lorcana-types";
import { oneJumpAheadI18n } from "./164-one-jump-ahead.i18n";

export const oneJumpAhead: ActionCard = {
  id: "2rr",
  canonicalId: "ci_0Iz",
  reprints: ["set1-164", "set9-165"],
  cardType: "action",
  name: "One Jump Ahead",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "001",
  cardNumber: 164,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_5bc8b5538ba94d59979d7ebb574c0bd2",
    tcgPlayer: 650099,
  },
  text: "Put the top card of your deck into your inkwell facedown and exerted.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "put-into-inkwell",
        source: "top-of-deck",
        facedown: true,
        exerted: true,
      },
    },
  ],
  i18n: oneJumpAheadI18n,
};
