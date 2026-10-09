import type { CharacterCard } from "@tcg/op-types";
import { st33Koby001I18n } from "./st33-001-koby.i18n.ts";
export const st33Koby001: CharacterCard = {
  id: "ST33-001",
  canonicalId: "ST33-001",
  slug: "koby/st33-001",
  name: "Koby",
  printings: [
    {
      id: "ST33-001",
      artId: "ST33-001",
      setCode: "ST33",
      collectorNumber: "001",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST33-001.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "ST33",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] You may trash 1 card from your hand: Draw 1 card.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st33Koby001I18n,
};
