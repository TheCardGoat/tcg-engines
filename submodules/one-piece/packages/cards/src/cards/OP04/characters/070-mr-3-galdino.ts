import type { CharacterCard } from "@tcg/op-types";
import { op04Mr3Galdino070I18n } from "./070-mr-3-galdino.i18n.ts";

export const op04Mr3Galdino070: CharacterCard = {
  id: "OP04-070",
  canonicalId: "OP04-070",
  slug: "mr-3-galdino/op04-070",
  name: "Mr.3 (Galdino)",
  printings: [
    {
      id: "OP04-070",
      artId: "OP04-070",
      setCode: "OP04",
      collectorNumber: "070",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-070.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP04",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "special",
  effect:
    "[On Your Opponent's Attack] [Once Per Turn] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Give up to 1 of your opponent's Characters -1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
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
            value: -1000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op04Mr3Galdino070I18n,
};
