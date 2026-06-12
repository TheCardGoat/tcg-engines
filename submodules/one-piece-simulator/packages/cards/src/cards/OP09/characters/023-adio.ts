import type { CharacterCard } from "@tcg/op-types";
import { op09Adio023I18n } from "./023-adio.i18n.ts";

export const op09Adio023: CharacterCard = {
  id: "OP09-023",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP09",
  cost: 9,
  power: 9000,
  traits: ["ODYSSEY"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-023_p1.jpg",
      imageId: "OP09-023_p1",
    },
  ],
  effect:
    '[On Play] If your Leader has the "ODYSSEY" type, set up to 3 of your DON!! cards as active.\n[On Your Opponent\'s Attack] [Once Per Turn] You may rest 1 of your DON!! cards: Up to 1 of your Leader or Character cards gains +2000 power during this battle.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "ODYSSEY",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 3,
                upTo: true,
              },
            },
          },
        ],
      },
      {
        trigger: "onOpponentAttack",
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
  i18n: op09Adio023I18n,
};
