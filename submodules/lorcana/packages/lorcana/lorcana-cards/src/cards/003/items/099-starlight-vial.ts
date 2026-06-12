import type { ItemCard } from "@tcg/lorcana-types";
import { starlightVialI18n } from "./099-starlight-vial.i18n";

export const starlightVial: ItemCard = {
  id: "0Az",
  canonicalId: "ci_0Az",
  reprints: ["set3-099"],
  cardType: "item",
  name: "Starlight Vial",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "003",
  cardNumber: 99,
  rarity: "rare",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_c6b673289f9a4d2680a50dc6be9605dc",
    tcgPlayer: 539086,
  },
  text: [
    {
      title: "EFFICIENT ENERGY",
      description: "{E} — You pay 2 {I} less for the next action you play this turn.",
    },
    {
      title: "TRAP 2",
      description: "{I}, Banish this item — Draw 2 cards, then choose and discard a card.",
    },
  ],
  abilities: [
    {
      id: "0Az-1",
      name: "EFFICIENT ENERGY",
      text: "EFFICIENT ENERGY {E} — You pay 2 {I} less for the next action you play this turn.",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        amount: 2,
        cardType: "action",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
    },
    {
      id: "0Az-2",
      name: "TRAP 2",
      text: "TRAP 2 {I}, Banish this item — Draw 2 cards, then choose and discard a card.",
      type: "activated",
      cost: {
        ink: 2,
        banishSelf: true,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            amount: 2,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            amount: 1,
            chosen: true,
            from: "hand",
            target: "CONTROLLER",
            type: "discard",
          },
        ],
      },
    },
  ],
  i18n: starlightVialI18n,
};
