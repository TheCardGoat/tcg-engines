import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Terracotta024I18n } from "./024-terracotta.i18n.ts";

export const op14eb04Terracotta024: CharacterCard = {
  id: "EB04-024",
  canonicalId: "EB04-024",
  slug: "terracotta",
  name: "Terracotta",
  printings: [
    {
      id: "EB04-024",
      artId: "EB04-024",
      setCode: "OP14EB04",
      collectorNumber: "024",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-024_E8dpmD0.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 2,
  power: 0,
  counter: 2000,
  traits: ["Alabasta"],
  attribute: "wisdom",
  effect:
    "[Activate: Main] You may rest this Character and trash 1 card from your hand: Up to 1 of your {Alabasta} type Characters gains [Unblockable] during this turn.(This card cannot be blocked.)",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Alabasta",
                },
              ],
            },
            keyword: "unblockable",
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04Terracotta024I18n,
};
