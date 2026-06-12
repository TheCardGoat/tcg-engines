import type { ItemCard } from "@tcg/lorcana-types";
import { kristoffsLuteI18n } from "./133-kristoffs-lute.i18n";

export const kristoffsLute: ItemCard = {
  id: "NgK",
  canonicalId: "ci_NgK",
  reprints: ["set11-133"],
  cardType: "item",
  name: "Kristoff's Lute",
  inkType: ["ruby"],
  franchise: "Frozen",
  set: "011",
  cardNumber: 133,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_ec94f5c4a31b40c99f5b421ac7dd3acf",
    tcgPlayer: 675510,
  },
  text: [
    {
      title: "MOMENT OF INSPIRATION",
      description:
        "{E}, 2 {I} — Reveal the top card of your deck. You may play it as if it were in your hand. Otherwise, put it in your discard.",
    },
  ],
  abilities: [
    {
      id: "ycf-1",
      name: "MOMENT OF INSPIRATION",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal-top-card",
            target: "CONTROLLER",
          },
          {
            type: "or",
            chooser: "CONTROLLER",
            options: [
              {
                type: "play-card",
                from: "revealed",
                target: "CONTROLLER",
              },
              {
                type: "mill",
                amount: 1,
                target: "CONTROLLER",
              },
            ],
          },
        ],
      },
      type: "activated",
      text: "MOMENT OF INSPIRATION {E}, 2 {I} - Reveal the top card of your deck. You may play it as if it were in your hand. Otherwise, put it in your discard.",
    },
  ],
  i18n: kristoffsLuteI18n,
};
