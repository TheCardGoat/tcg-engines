import type { CharacterCard } from "@tcg/op-types";
import { st36Cavendish001I18n } from "./st36-001-cavendish.i18n.ts";
export const st36Cavendish001: CharacterCard = {
  id: "ST36-001",
  canonicalId: "ST36-001",
  slug: "cavendish/st36-001",
  name: "Cavendish",
  printings: [
    {
      id: "ST36-001",
      artId: "ST36-001",
      setCode: "ST36",
      collectorNumber: "001",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST36-001.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST36",
  cost: 3,
  traits: ["Dressrosa", "Supernovas", "Beautiful Pirates"],
  power: 3000,
  attribute: "slash",
  counter: 2000,
  effect:
    "[On K.O.] You may trash 1 card from your hand: Add up to 1 card from the top of your deck to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st36Cavendish001I18n,
};
