import type { CharacterCard } from "@tcg/op-types";
import { st26SobaMask001I18n } from "./st26-001-soba-mask.i18n.ts";
export const st26SobaMask001: CharacterCard = {
  id: "ST26-001",
  canonicalId: "ST26-001",
  slug: "soba-mask/st26-001",
  name: "Soba Mask",
  printings: [
    {
      id: "ST26-001",
      artId: "ST26-001",
      setCode: "ST26",
      collectorNumber: "001",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST26-001.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST26",
  cost: 7,
  power: 9000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "If you have a [San-Gorou] or [Sanji] Character with 7000 base power or more, give this card in your hand −5 cost. [On Play] Return all of your [San-Gorou] and [Sanji] Characters to the owner's hand.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "name",
                    value: "San-Gorou",
                  },
                  {
                    filter: "name",
                    value: "Sanji",
                  },
                ],
              },
              {
                filter: "basePower",
                comparison: "gte",
                value: 7000,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: -5,
            duration: "permanent",
          },
        ],
      },
    ],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "anyOf",
                  filters: [
                    {
                      filter: "name",
                      value: "San-Gorou",
                    },
                    {
                      filter: "name",
                      value: "Sanji",
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st26SobaMask001I18n,
};
