import type { EventCard } from "@tcg/op-types";
import { op12TheExtinguishesAllSoundCreatedByYourInfluenceTechnique077I18n } from "./077-the-extinguishes-all-sound-created-by-your-influence-technique.i18n.ts";

export const op12TheExtinguishesAllSoundCreatedByYourInfluenceTechnique077: EventCard = {
  id: "OP12-077",
  canonicalId: "OP12-077",
  slug: "the-extinguishes-all-sound-created-by-your-influence-technique",
  name: 'The "Extinguishes All Sound Created by Your Influence" Technique',
  printings: [
    {
      id: "OP12-077",
      artId: "OP12-077",
      setCode: "OP12",
      collectorNumber: "077",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-077_7NJyGhA.jpg",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "OP12",
  cost: 2,
  trigger: "Draw 1 card.",
  traits: ["Heart Pirates"],
  effect:
    "[Main] Select up to 1 of your [Trafalgar Law] cards and that card gains +2000 power during this turn. Then, if the selected card attacks during this turn, your opponent cannot activate [Blocker].",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
          {
            action: "cannotActivate",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            keyword: "blocker",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op12TheExtinguishesAllSoundCreatedByYourInfluenceTechnique077I18n,
};
