import type { EventCard } from "@tcg/op-types";
import { op11GumGumJetCulverin061I18n } from "./061-gum-gum-jet-culverin.i18n.ts";

export const op11GumGumJetCulverin061: EventCard = {
  id: "OP11-061",
  canonicalId: "OP11-061",
  slug: "gum-gum-jet-culverin",
  name: "Gum-Gum Jet Culverin",
  printings: [
    {
      id: "OP11-061",
      artId: "OP11-061",
      setCode: "OP11",
      collectorNumber: "061",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-061.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "OP11",
  cost: 3,
  trigger: "Place up to 1 Character with a cost of 1 or less at the bottom of the owner's deck.",
  traits: ["Straw Hat Crew"],
  effect:
    "[Main] Place up to 1 of your opponent's Characters with a base cost of 4 or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "returnToDeck",
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
                  value: 4,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op11GumGumJetCulverin061I18n,
};
