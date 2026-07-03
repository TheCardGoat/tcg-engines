import type { CharacterCard } from "@tcg/op-types";
import { op10TonyTonyChopper011I18n } from "./011-tony-tony-chopper.i18n.ts";

export const op10TonyTonyChopper011: CharacterCard = {
  id: "OP10-011",
  canonicalId: "OP10-011",
  slug: "tony-tony-chopper/op10-011",
  name: "Tony Tony.Chopper",
  printings: [
    {
      id: "OP10-011",
      artId: "OP10-011",
      setCode: "OP10",
      collectorNumber: "011",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-011.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP10",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Straw Hat Crew Punk Hazard"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[Opponent's Turn] This Character gains +2000 power.",
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [
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
  i18n: op10TonyTonyChopper011I18n,
};
