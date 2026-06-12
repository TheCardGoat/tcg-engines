import type { CharacterCard } from "@tcg/op-types";
import { op12MarshallDTeachSpGold093I18n } from "./093-marshall-d-teach-sp-gold.i18n.ts";

export const op12MarshallDTeachSpGold093: CharacterCard = {
  id: "OP09-093",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP12",
  cost: 10,
  power: 12000,
  traits: ["Blackbeard Pirates The Four Emperors"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-093_p4_yGd9lfW.jpg",
      imageId: "OP09-093_p4",
    },
  ],
  effect:
    "[Blocker]\n[Activate: Main] [Once Per Turn] If your Leader has the \"Blackbeard Pirates\" type and this Character was played on this turn, negate the effect of up to 1 of your opponent's Leader during this turn. Then, negate the effect of up to 1 of your opponent's Characters and that Character cannot attack until the end of your opponent's next turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Blackbeard Pirates",
              },
              {
                condition: "playedThisTurn",
              },
            ],
          },
        ],
        actions: [
          {
            action: "negateEffects",
            target: {
              player: "opponent",
              zones: ["leader"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op12MarshallDTeachSpGold093I18n,
};
