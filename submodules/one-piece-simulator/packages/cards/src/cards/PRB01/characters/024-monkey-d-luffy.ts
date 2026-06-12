import type { CharacterCard } from "@tcg/op-types";
import { prb01MonkeyDLuffy024I18n } from "./024-monkey-d-luffy.i18n.ts";

export const prb01MonkeyDLuffy024: CharacterCard = {
  id: "OP01-024",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "PRB01",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Supernovas", "Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-024_p3.jpg",
      imageId: "OP01-024_p3",
    },
  ],
  effect:
    '[DON!! x2] This Character cannot be K.O.\'d in battle by "Strike" attribute Characters.   [Activate:Main] [Once Per Turn] Give this Character up to 2 rested DON!! cards.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            count: {
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            restriction: "inBattle",
            byFilter: [
              {
                filter: "attribute",
                value: "strike",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: prb01MonkeyDLuffy024I18n,
};
