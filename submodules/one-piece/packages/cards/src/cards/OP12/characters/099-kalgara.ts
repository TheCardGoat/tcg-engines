import type { CharacterCard } from "@tcg/op-types";
import { op12Kalgara099I18n } from "./099-kalgara.i18n.ts";

export const op12Kalgara099: CharacterCard = {
  id: "OP12-099",
  canonicalId: "OP12-099",
  slug: "kalgara/op12-099",
  name: "Kalgara",
  printings: [
    {
      id: "OP12-099",
      artId: "OP12-099",
      setCode: "OP12",
      collectorNumber: "099",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-099_Vd5ewuR.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP12",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Sky Island Shandian Warrior Jaya"],
  attribute: "slash",
  effect:
    "[Your Turn] When a card is removed from your or your opponent's Life cards, draw 1 card. Then, you cannot draw cards using your own effects during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenLifeRemoved",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "cannotDraw",
            player: "self",
            source: "ownEffects",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op12Kalgara099I18n,
};
