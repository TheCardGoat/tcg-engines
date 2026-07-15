import type { EventCard } from "@tcg/op-types";
import { op13GumGumElephantGun038I18n } from "./038-gum-gum-elephant-gun.i18n.ts";

export const op13GumGumElephantGun038: EventCard = {
  id: "OP13-038",
  canonicalId: "OP13-038",
  slug: "gum-gum-elephant-gun",
  name: "Gum-Gum Elephant Gun",
  printings: [
    {
      id: "OP13-038",
      artId: "OP13-038",
      setCode: "OP13",
      collectorNumber: "038",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-038_9dTA9Ab.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "UC",
  setId: "OP13",
  cost: 2,
  trigger: "Rest up to 1 of your opponent's Characters with a cost of 5 or less.",
  traits: ["Straw Hat Crew Supernovas"],
  effect:
    "[Main] Rest up to 1 of your opponent's Characters with a cost of 5 or less. Then, set up to 2 of your DON!! cards as active at the end of this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op13GumGumElephantGun038I18n,
};
