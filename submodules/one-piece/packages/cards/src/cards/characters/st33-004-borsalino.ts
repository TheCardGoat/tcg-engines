import type { CharacterCard } from "@tcg/op-types";
import { st33Borsalino004I18n } from "./st33-004-borsalino.i18n.ts";
export const st33Borsalino004: CharacterCard = {
  id: "ST33-004",
  canonicalId: "ST33-004",
  slug: "borsalino/st33-004",
  name: "Borsalino",
  printings: [
    {
      id: "ST33-004",
      artId: "ST33-004",
      setCode: "ST33",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST33-004.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "ST33",
  cost: 6,
  power: 6000,
  counter: 2000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "During the turn in which a card in your hand is trashed by an effect, give this card in your hand −3 cost. [Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [{ condition: "cardTrashedFromHandByEffectThisTurn", player: "self" }],
        actions: [
          {
            action: "modifyCost",
            target: { player: "self", zones: ["hand"], count: { amount: 1 }, self: true },
            value: -3,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st33Borsalino004I18n,
};
