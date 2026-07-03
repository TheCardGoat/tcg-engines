import type { CharacterCard } from "@tcg/op-types";
import { op09TonyTonyChopper029I18n } from "./029-tony-tony-chopper.i18n.ts";

export const op09TonyTonyChopper029: CharacterCard = {
  id: "OP09-029",
  canonicalId: "OP09-029",
  slug: "tony-tony-chopper/op09-029",
  name: "Tony Tony.Chopper",
  printings: [
    {
      id: "OP09-029",
      artId: "OP09-029",
      setCode: "OP09",
      collectorNumber: "029",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-029.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP09",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Animal Straw Hat Crew ODYSSEY"],
  attribute: "strike",
  effect:
    '[End of Your Turn] Set up to 1 of your "ODYSSEY" type Characters with a cost of 4 or less as active.',
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "setActive",
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
                  value: "ODYSSEY",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op09TonyTonyChopper029I18n,
};
