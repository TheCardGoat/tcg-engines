import type { CharacterCard } from "@tcg/op-types";
import { st30LittleOarsJr009I18n } from "./st30-009-littleoars-jr.i18n.ts";
export const st30LittleOarsJr009: CharacterCard = {
  id: "ST30-009",
  canonicalId: "ST30-009",
  slug: "littleoars-jr/st30-009",
  name: "LittleOars Jr.",
  printings: [
    {
      id: "ST30-009",
      artId: "ST30-009",
      setCode: "ST30",
      collectorNumber: "009",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST30-009.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST30",
  cost: 1,
  traits: ["Giant", "Whitebeard Pirates Allies"],
  power: 2000,
  attribute: "strike",
  counter: 1000,
  effect:
    "If your Character with 6000 base power would be removed from the field by your opponent's effect, you may trash this Character and draw 1 card instead.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        target: {
          player: "self",
          zones: ["character"],
          count: {
            amount: 1,
          },
          filters: [
            {
              filter: "basePower",
              comparison: "eq",
              value: 6000,
            },
          ],
        },
        source: "opponentEffect",
        replacementAction: {
          action: "sequence",
          actions: [
            {
              action: "trashFromField",
              target: {
                player: "self",
                zones: ["character"],
                count: {
                  amount: 1,
                },
                self: true,
              },
            },
            {
              action: "draw",
              player: "self",
              amount: 1,
            },
          ],
        },
      },
    ],
  },
  i18n: st30LittleOarsJr009I18n,
};
