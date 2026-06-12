import type { ItemCard } from "@tcg/lorcana-types";
import { batteringRamI18n } from "./101-battering-ram.i18n";

export const batteringRam: ItemCard = {
  id: "3pR",
  canonicalId: "ci_3pR",
  reprints: ["set11-101"],
  cardType: "item",
  name: "Battering Ram",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "011",
  cardNumber: 101,
  rarity: "rare",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_c49a2f008f0048d4951384b30880eba6",
    tcgPlayer: 675394,
  },
  text: [
    {
      title: "FULL FORCE",
      description: "{E} — Deal 1 damage to chosen damaged character.",
    },
    {
      title: "BREAK THROUGH",
      description: "{E}, Banish this item — Banish chosen location.",
    },
  ],
  abilities: [
    {
      id: "1bw-1",
      name: "FULL FORCE",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "damaged",
            },
          ],
        },
      },
      text: "FULL FORCE {E} — Deal 1 damage to chosen damaged character.",
    },
    {
      id: "1bw-2",
      name: "BREAK THROUGH",
      type: "activated",
      cost: {
        exert: true,
        banishSelf: true,
      },
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["location"],
        },
      },
      text: "BREAK THROUGH {E}, Banish this item — Banish chosen location.",
    },
  ],
  i18n: batteringRamI18n,
};
