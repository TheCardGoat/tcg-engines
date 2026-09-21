import type { CharacterCard } from "@tcg/op-types";
import { op17King064I18n } from "./op17-064-king.i18n.ts";

export const op17King064: CharacterCard = {
  id: "OP17-064",
  canonicalId: "OP17-064",
  slug: "king/op17-064",
  name: "King",
  printings: [
    {
      id: "OP17-064",
      artId: "OP17-064",
      setCode: "OP17",
      collectorNumber: "064",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-064.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP17",
  cost: 9,
  power: 10000,
  traits: ["Lunarian Animal Kingdom Pirates"],
  attribute: "special",
  effect:
    "[Blocker] [On Your Opponent's Attack] [Once Per Turn] You may trash 1 card from your hand: Up to 1 of your Leader or Characters gains +2000 power during this battle.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "trashFromHand",
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
            value: 2000,
            duration: "thisBattle",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op17King064I18n,
};
