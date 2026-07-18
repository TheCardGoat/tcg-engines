import type { CharacterCard } from "@tcg/op-types";
import { op04CharlotteAmande105I18n } from "./105-charlotte-amande.i18n.ts";

export const op04CharlotteAmande105: CharacterCard = {
  id: "OP04-105",
  canonicalId: "OP04-105",
  slug: "charlotte-amande",
  name: "Charlotte Amande",
  printings: [
    {
      id: "OP04-105",
      artId: "OP04-105",
      setCode: "OP04",
      collectorNumber: "105",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-105.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP04",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Big Mom Pirates"],
  attribute: "slash",
  effect:
    "[Activate:Main] [Once Per Turn] You may trash 1 card with a [Trigger] from your hand: Rest up to 1 of your opponent's Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [{ filter: "hasTrigger", value: true }],
          },
        ],
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
                  value: 2,
                },
              ],
            },
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op04CharlotteAmande105I18n,
};
