import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Vergo061I18n } from "./061-vergo.i18n.ts";

export const op14eb04Vergo061: CharacterCard = {
  id: "OP14-061",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 5,
  power: 7000,
  traits: ["Donquixote Pirates Navy Punk Hazard"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-061_p1_S6owozX.jpg",
      imageId: "OP14-061_p1",
    },
  ],
  effect:
    "[Once Per Turn] If your {Donquixote Pirates} type Character would be removed from the field by your opponent's effect, you may return 1 DON!! card from your field to your DON!! deck instead.\n[When Attacking] DON!! 1: Give up to 1 of your opponent's Characters 2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        replacementAction: {
          action: "opponentReturnDon",
          amount: 1,
        },
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04Vergo061I18n,
};
