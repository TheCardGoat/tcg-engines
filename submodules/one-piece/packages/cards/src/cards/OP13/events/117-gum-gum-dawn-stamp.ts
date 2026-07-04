import type { EventCard } from "@tcg/op-types";
import { op13GumGumDawnStamp117I18n } from "./117-gum-gum-dawn-stamp.i18n.ts";

export const op13GumGumDawnStamp117: EventCard = {
  id: "OP13-117",
  canonicalId: "OP13-117",
  slug: "gum-gum-dawn-stamp",
  name: "Gum-Gum Dawn Stamp",
  printings: [
    {
      id: "OP13-117",
      artId: "OP13-117",
      setCode: "OP13",
      collectorNumber: "117",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-117_6Nnfp7Z.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "R",
  setId: "OP13",
  cost: 5,
  trigger: "Draw 1 card.",
  traits: ["Straw Hat Crew The Four Emperors Egghead"],
  effect:
    "[Main] You may turn 1 card from the top of your Life cards face-up: K.O. up to 1 of your opponent's Characters with a base cost of 6 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "turnLifeFaceUp",
            count: 1,
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "baseCost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op13GumGumDawnStamp117I18n,
};
