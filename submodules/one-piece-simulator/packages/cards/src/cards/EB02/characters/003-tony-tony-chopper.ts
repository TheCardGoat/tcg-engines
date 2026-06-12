import type { CharacterCard } from "@tcg/op-types";
import { eb02TonyTonyChopper003I18n } from "./003-tony-tony-chopper.i18n.ts";

export const eb02TonyTonyChopper003: CharacterCard = {
  id: "EB02-003",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "EB02",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Animal Straw Hat Crew Drum Kingdom"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-003_p1.png",
      imageId: "EB02-003_p1",
    },
  ],
  effect:
    '[DON!! x2] [Opponent\'s Turn] This Character gains +2000 power.\n[On Play] If your Leader has the "Straw Hat Crew" type, give up to 1 rested DON!! card to your Leader or 1 of your Characters.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Straw Hat Crew",
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: eb02TonyTonyChopper003I18n,
};
