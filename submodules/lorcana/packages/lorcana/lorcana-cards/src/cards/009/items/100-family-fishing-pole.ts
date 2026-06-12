import type { ItemCard } from "@tcg/lorcana-types";
import { familyFishingPoleI18n } from "./100-family-fishing-pole.i18n";

export const familyFishingPole: ItemCard = {
  id: "jDl",
  canonicalId: "ci_jDl",
  reprints: ["set9-100"],
  cardType: "item",
  name: "Family Fishing Pole",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "009",
  cardNumber: 100,
  rarity: "rare",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b081887da7a445c0b0a5a1404d9102b0",
    tcgPlayer: 650038,
  },
  text: [
    {
      title: "WATCH CLOSELY",
      description: "This item enters play exerted.",
    },
    {
      title: "THE PERFECT CAST",
      description:
        "{E}, 1 {I}, Banish this item — Return chosen exerted character of yours to your hand to gain 2 lore.",
    },
  ],
  abilities: [
    {
      effect: {
        restriction: "enters-play-exerted",
        target: "SELF",
        type: "restriction",
      },
      id: "xac-1",
      name: "WATCH CLOSELY",
      text: "WATCH CLOSELY This item enters play exerted.",
      type: "static",
    },
    {
      cost: {
        exert: true,
        ink: 1,
        banishSelf: true,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "exerted",
                },
              ],
            },
            type: "return-to-hand",
          },
          {
            amount: 2,
            type: "gain-lore",
          },
        ],
      },
      id: "xac-2",
      text: "THE PERFECT CAST {E}, 1 {I}, Banish this item – Return chosen exerted character of yours to your hand to gain 2 lore.",
      name: "THE PERFECT CAST",
      type: "activated",
    },
  ],
  i18n: familyFishingPoleI18n,
};
