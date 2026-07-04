import type { CharacterCard } from "@tcg/op-types";
import { op01BaoHuang105I18n } from "./105-bao-huang.i18n.ts";

export const op01BaoHuang105: CharacterCard = {
  id: "OP01-105",
  canonicalId: "OP01-105",
  slug: "bao-huang",
  name: "Bao Huang",
  printings: [
    {
      id: "OP01-105",
      artId: "OP01-105",
      setCode: "OP01",
      collectorNumber: "105",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-105.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP01",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates SMILE"],
  attribute: "wisdom",
  effect: "[On Play] Choose 2 cards from your opponent's hand; your opponent reveals those cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "revealFromHand",
            player: "opponent",
            amount: 2,
            chosenBy: "self",
          },
        ],
      },
    ],
  },
  i18n: op01BaoHuang105I18n,
};
