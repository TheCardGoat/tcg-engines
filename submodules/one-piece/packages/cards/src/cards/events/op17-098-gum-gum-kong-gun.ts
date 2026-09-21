import type { EventCard } from "@tcg/op-types";
import { op17GumGumKongGun098I18n } from "./op17-098-gum-gum-kong-gun.i18n.ts";

export const op17GumGumKongGun098: EventCard = {
  id: "OP17-098",
  canonicalId: "OP17-098",
  slug: "gum-gum-kong-gun/op17-098",
  name: "Gum-Gum Kong Gun",
  printings: [
    {
      id: "OP17-098",
      artId: "OP17-098",
      setCode: "OP17",
      collectorNumber: "098",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-098_mDUugf5.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP17",
  cost: 1,
  traits: ["Elbaph The Four Emperors Straw Hat Crew"],
  effect:
    "[Main] You may rest 6 of your DON!! cards: If there is a Character with a cost of 12 or more, K.O. up to 2 of your opponent's Characters with a cost of 6 or less.\n[Counter] Your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "restDon",
            amount: 6,
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
            condition: {
              condition: "existsOnField",
              zone: "character",
              filters: [
                {
                  filter: "cost",
                  comparison: "gte",
                  value: 12,
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
              },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op17GumGumKongGun098I18n,
};
