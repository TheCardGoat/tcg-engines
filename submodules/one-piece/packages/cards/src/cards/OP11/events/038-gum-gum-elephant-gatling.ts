import type { EventCard } from "@tcg/op-types";
import { op11GumGumElephantGatling038I18n } from "./038-gum-gum-elephant-gatling.i18n.ts";

export const op11GumGumElephantGatling038: EventCard = {
  id: "OP11-038",
  canonicalId: "OP11-038",
  slug: "gum-gum-elephant-gatling",
  name: "Gum-Gum Elephant Gatling",
  printings: [
    {
      id: "OP11-038",
      artId: "OP11-038",
      setCode: "OP11",
      collectorNumber: "038",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-038.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "OP11",
  cost: 1,
  traits: ["Straw Hat Crew Supernovas Fish-Man Island"],
  effect:
    "[Main] You may rest 1 of your DON!! cards: Rest up to 1 of your opponent's Characters with a cost of 5 or less.\n[Counter] Up to 1 of your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [{ cost: "restDon", amount: 1 }],
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
        ],
        optional: true,
      },
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op11GumGumElephantGatling038I18n,
};
