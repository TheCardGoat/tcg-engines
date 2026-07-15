import type { EventCard } from "@tcg/op-types";
import { op14eb04StriveToSurpassMeRoronoaZoro036I18n } from "./036-strive-to-surpass-me-roronoa-zoro.i18n.ts";

export const op14eb04StriveToSurpassMeRoronoaZoro036: EventCard = {
  id: "OP14-036",
  canonicalId: "OP14-036",
  slug: "strive-to-surpass-me-roronoa-zoro",
  name: "Strive to Surpass me, Roronoa Zoro!!!",
  printings: [
    {
      id: "OP14-036",
      artId: "OP14-036",
      setCode: "OP14EB04",
      collectorNumber: "036",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-036_xYpOu9r.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 1,
  trigger:
    "You may rest 1 of your cards: Rest up to 1 of your opponent's Characters with 7000 base power or less.",
  traits: ["The Seven Warlords of the Sea East Blue"],
  effect:
    "[Counter] You may rest 1 of your cards: Up to 1 of your Leader or Character cards gains +4000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "counter",
        costs: [
          {
            cost: "restCards",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 4000,
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04StriveToSurpassMeRoronoaZoro036I18n,
};
