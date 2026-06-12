import type { CharacterCard } from "@tcg/op-types";
import { prb02TrafalgarLawPrb02002002I18n } from "./002-trafalgar-law-prb02-002.i18n.ts";

export const prb02TrafalgarLawPrb02002002: CharacterCard = {
  id: "PRB02-002",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "PRB02",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Heart Pirates The Seven Warlords of the Sea Punk Hazard"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-002_p1.jpg",
      imageId: "PRB02-002_p1",
    },
  ],
  effect:
    "[Once Per Turn] If this Character would be removed from the field by your opponent's effect, you may give this Character -2000 power during this turn instead.[When Attacking] Give up to 1 of your opponent's Characters -2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
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
            value: -2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        replacementAction: {
          action: "modifyPower",
          target: {
            player: "self",
            zones: ["character"],
            count: {
              amount: 1,
            },
            self: true,
          },
          value: -2000,
          duration: "thisTurn",
        },
        oncePerTurn: true,
      },
    ],
  },
  i18n: prb02TrafalgarLawPrb02002002I18n,
};
