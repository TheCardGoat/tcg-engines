import type { CharacterCard } from "@tcg/op-types";
import { eb04BartholomewKuma054I18n } from "./eb04-054-bartholomew-kuma.i18n.ts";

export const eb04BartholomewKuma054: CharacterCard = {
  id: "EB04-054",
  canonicalId: "EB04-054",
  slug: "bartholomew-kuma/eb04-054",
  name: "Bartholomew Kuma",
  printings: [
    {
      id: "EB04-054",
      artId: "EB04-054",
      setCode: "EB04",
      collectorNumber: "054",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-054_wmLW4Xl.jpg",
      label: "Bartholomew Kuma (EB04-054)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "EB04",
  cost: 7,
  power: 7000,
  counter: 1000,
  traits: ["Revolutionary Army Egghead"],
  attribute: "strike",
  effect:
    "[On Play] If you have 2 or less Life cards, add up to 1 card from the top of your deck to the top of your Life cards.\n[On K.O.] Add up to 1 card from the top of your opponent's Life cards to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
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
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "removeFromLife",
            player: "opponent",
            count: {
              amount: 1,
              upTo: true,
            },
            destination: "hand",
          },
        ],
      },
    ],
  },
  i18n: eb04BartholomewKuma054I18n,
};
