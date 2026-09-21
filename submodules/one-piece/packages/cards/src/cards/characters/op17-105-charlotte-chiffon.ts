import type { CharacterCard } from "@tcg/op-types";
import { op17CharlotteChiffon105I18n } from "./op17-105-charlotte-chiffon.i18n.ts";

export const op17CharlotteChiffon105: CharacterCard = {
  id: "OP17-105",
  canonicalId: "OP17-105",
  slug: "charlotte-chiffon/op17-105",
  name: "Charlotte Chiffon",
  printings: [
    {
      id: "OP17-105",
      artId: "OP17-105",
      setCode: "OP17",
      collectorNumber: "105",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-105_kxEF1uc.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP17",
  cost: 5,
  power: 0,
  counter: 1000,
  traits: ["Firetank Pirates Former Big Mom Pirates"],
  attribute: "wisdom",
  effect:
    "[On Play] You may trash 1 card with a [Trigger] from your hand: Return up to 1 of your opponent's Characters with a [Trigger] to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "hasTrigger",
                value: true,
              },
            ],
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "hasTrigger",
                  value: true,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op17CharlotteChiffon105I18n,
};
