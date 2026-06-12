import type { ActionCard } from "@tcg/lorcana-types";
import { walkThePlankI18n } from "./118-walk-the-plank.i18n";

export const walkThePlank: ActionCard = {
  id: "m8D",
  canonicalId: "ci_m8D",
  reprints: ["set8-118"],
  cardType: "action",
  name: "Walk the Plank!",
  inkType: ["emerald", "steel"],
  franchise: "Peter Pan",
  set: "008",
  cardNumber: 118,
  rarity: "uncommon",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_d5390ce678f1438eb716de9952cfd9d2",
    tcgPlayer: 631427,
  },
  text: 'Your Pirate characters gain "{E} — Banish chosen damaged character" this turn.',
  abilities: [
    {
      type: "action",
      text: 'Your Pirate characters gain "{E} — Banish chosen damaged character" this turn.',
      effect: {
        type: "grant-ability",
        ability: "banish-damaged-when-exerted",
        duration: "this-turn",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Pirate",
            },
          ],
        },
      },
    },
  ],
  i18n: walkThePlankI18n,
};
