import type { CharacterCard } from "@tcg/op-types";
import { op15Morgan017I18n } from "./op15-017-morgan.i18n.ts";

export const op15Morgan017: CharacterCard = {
  id: "OP15-017",
  canonicalId: "OP15-017",
  slug: "morgan/op15-017",
  name: "Morgan",
  printings: [
    {
      id: "OP15-017",
      artId: "OP15-017",
      setCode: "OP15",
      collectorNumber: "017",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-017.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP15",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Navy East Blue"],
  attribute: "slash",
  effect:
    "[Activate: Main] [Once Per Turn] You may give 1 of your opponent's rested DON!! cards to 1 of your opponent's Characters: Give up to 1 rested DON!! card to its owner's Leader or 1 of their Characters.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        oncePerTurn: true,
        optional: true,
        costs: [
          {
            cost: "giveDon",
            amount: 1,
            donorPlayer: "opponent",
            donState: "rested",
            recipientPlayer: "opponent",
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donorPlayer: "opponent",
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op15Morgan017I18n,
};
