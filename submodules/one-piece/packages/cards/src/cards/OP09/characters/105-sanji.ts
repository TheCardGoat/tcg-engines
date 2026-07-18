import type { CharacterCard } from "@tcg/op-types";
import { op09Sanji105I18n } from "./105-sanji.i18n.ts";

export const op09Sanji105: CharacterCard = {
  id: "OP09-105",
  canonicalId: "OP09-105",
  slug: "sanji/op09-105",
  name: "Sanji",
  printings: [
    {
      id: "OP09-105",
      artId: "OP09-105",
      setCode: "OP09",
      collectorNumber: "105",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-105.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP09",
  cost: 5,
  power: 6000,
  counter: 1000,
  trigger:
    'If your Leader has the "Egghead" type, add up to 1 card from the top of your deck to the top of your Life cards. Then, trash 2 cards from your hand.',
  traits: ["Straw Hat Crew Egghead"],
  attribute: "strike",
  effect:
    '[Trigger] If your Leader has the "Egghead" type, add up to 1 card from the top of your deck to the top of your Life cards. Then, trash 2 cards from your hand.',
  effects: {
    effects: [
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Egghead",
            match: "includes",
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
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op09Sanji105I18n,
};
