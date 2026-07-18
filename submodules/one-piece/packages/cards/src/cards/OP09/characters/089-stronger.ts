import type { CharacterCard } from "@tcg/op-types";
import { op09Stronger089I18n } from "./089-stronger.i18n.ts";

export const op09Stronger089: CharacterCard = {
  id: "OP09-089",
  canonicalId: "OP09-089",
  slug: "stronger",
  name: "Stronger",
  printings: [
    {
      id: "OP09-089",
      artId: "OP09-089",
      setCode: "OP09",
      collectorNumber: "089",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-089.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP09",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Animal Blackbeard Pirates"],
  attribute: "wisdom",
  effect:
    '[Activate: Main] You may trash 1 card from your hand and trash this Character: If your Leader has the "Blackbeard Pirates" type, draw 1 card. Then, give up to 1 of your opponent\'s Characters –2 cost during this turn.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
            condition: {
              condition: "leaderTrait",
              trait: "Blackbeard Pirates",
              match: "includes",
            },
          },
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09Stronger089I18n,
};
