import type { ActionCard } from "@tcg/lorcana-types";
import { fanTheFlamesI18n } from "./131-fan-the-flames.i18n";

export const fanTheFlames: ActionCard = {
  id: "iMK",
  canonicalId: "ci_iMK",
  reprints: ["set1-131"],
  cardType: "action",
  name: "Fan the Flames",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "001",
  cardNumber: 131,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0df4378c1d3d40409014b2502a9926b1",
    tcgPlayer: 505992,
  },
  text: "Ready chosen character. They can't quest for the rest of this turn.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            duration: "this-turn",
            target: "CHOSEN_CHARACTER",
          },
        ],
      },
    },
  ],
  i18n: fanTheFlamesI18n,
};
