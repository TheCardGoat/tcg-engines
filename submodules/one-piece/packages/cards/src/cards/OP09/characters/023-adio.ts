import type { CharacterCard } from "@tcg/op-types";
import { op09Adio023I18n } from "./023-adio.i18n.ts";

export const op09Adio023: CharacterCard = {
  id: "OP09-023",
  canonicalId: "OP09-023",
  slug: "adio/op09-023",
  name: "Adio",
  printings: [
    {
      id: "OP09-023",
      artId: "OP09-023",
      setCode: "OP09",
      collectorNumber: "023",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-023.jpg",
    },
    {
      id: "OP09-023_p1",
      artId: "OP09-023_p1",
      setCode: "OP09",
      collectorNumber: "023",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-023_p1.jpg",
    },
  ],
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
            match: "includes",
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
        costs: [
          {
            cost: "restDon",
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
  i18n: op09Adio023I18n,
};
