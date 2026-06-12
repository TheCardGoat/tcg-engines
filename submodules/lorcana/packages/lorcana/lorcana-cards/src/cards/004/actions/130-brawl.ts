import type { ActionCard } from "@tcg/lorcana-types";
import { brawlI18n } from "./130-brawl.i18n";

export const brawl: ActionCard = {
  id: "eF8",
  canonicalId: "ci_eF8",
  reprints: ["set4-130"],
  cardType: "action",
  name: "Brawl",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "004",
  cardNumber: 130,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_be06b6df39cd46c2a192ae1be15fb42c",
    tcgPlayer: 547776,
  },
  text: "Banish chosen character with 2 {S} or less.",
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          filter: [
            {
              type: "strength-comparison",
              comparison: "less-or-equal",
              value: 2,
            },
          ],
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "banish",
      },
      id: "axa-1",
      text: "Banish chosen character with 2 {S} or less.",
      type: "action",
    },
  ],
  i18n: brawlI18n,
};
