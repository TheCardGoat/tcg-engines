import type { ActionCard } from "@tcg/lorcana-types";
import { energyBlastI18n } from "./131-energy-blast.i18n";

export const energyBlast: ActionCard = {
  id: "uDQ",
  canonicalId: "ci_uDQ",
  reprints: ["set6-131"],
  cardType: "action",
  name: "Energy Blast",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "006",
  cardNumber: 131,
  rarity: "rare",
  cost: 7,
  inkable: false,
  externalIds: {
    lorcast: "crd_d65c18ee25cd417bbb2c14e01f2a69a5",
    tcgPlayer: 591982,
  },
  text: "Banish chosen character. Draw a card.",
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "banish",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      id: "1j8-1",
      text: "Banish chosen character. Draw a card.",
      type: "action",
    },
  ],
  i18n: energyBlastI18n,
};
