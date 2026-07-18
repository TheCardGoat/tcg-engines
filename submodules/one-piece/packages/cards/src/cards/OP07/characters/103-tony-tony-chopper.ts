import type { CharacterCard } from "@tcg/op-types";
import { op07TonyTonyChopper103I18n } from "./103-tony-tony-chopper.i18n.ts";

export const op07TonyTonyChopper103: CharacterCard = {
  id: "OP07-103",
  canonicalId: "OP07-103",
  slug: "tony-tony-chopper/op07-103",
  name: "Tony Tony.Chopper",
  printings: [
    {
      id: "OP07-103",
      artId: "OP07-103",
      setCode: "OP07",
      collectorNumber: "103",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-103.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP07",
  cost: 2,
  power: 3000,
  counter: 1000,
  trigger:
    "Up to 1 of your {Egghead} type Characters gains [Blocker] during this turn. Then, add this card to your hand.",
  traits: ["Animal Straw Hat Crew Egghead"],
  attribute: "wisdom",
  effect:
    "[Trigger] Up to 1 of your {Egghead} type Characters gains [Blocker] during this turn. Then, add this card to your hand.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "trait", value: "Egghead", match: "includes" }],
            },
            keyword: "blocker",
            duration: "thisTurn",
          },
          {
            action: "addThisCardToHand",
          },
        ],
      },
    ],
  },
  i18n: op07TonyTonyChopper103I18n,
};
