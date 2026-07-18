import type { CharacterCard } from "@tcg/op-types";
import { eb03NicoRobin054I18n } from "./054-nico-robin.i18n.ts";

export const eb03NicoRobin054: CharacterCard = {
  id: "EB03-054",
  canonicalId: "EB03-054",
  slug: "nico-robin/eb03-054",
  name: "Nico Robin",
  printings: [
    {
      id: "EB03-054",
      artId: "EB03-054",
      setCode: "EB03",
      collectorNumber: "054",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-054_iN4H4uy.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "EB03",
  cost: 3,
  power: 5000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[On Play] You may trash 1 card from the top of your Life cards: Add up to 1 card from the top of your deck to the top of your Life cards. [Trigger] You may trash 1 card from your hand: Play this card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashLife",
            amount: 1,
            position: "top",
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
      {
        trigger: "trigger",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
            self: true,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb03NicoRobin054I18n,
};
