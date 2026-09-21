import type { CharacterCard } from "@tcg/op-types";
import { eb04Emet051I18n } from "./eb04-051-emet.i18n.ts";

export const eb04Emet051: CharacterCard = {
  id: "EB04-051",
  canonicalId: "EB04-051",
  slug: "emet/eb04-051",
  name: "Emet",
  printings: [
    {
      id: "EB04-051",
      artId: "EB04-051",
      setCode: "EB04",
      collectorNumber: "051",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-051_9av30QW.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "EB04",
  cost: 8,
  power: 7000,
  trigger:
    "Give all of your opponent's Characters -3000 power during this turn. Then, if you have 0 Life cards, play this card.",
  traits: ["Egghead"],
  attribute: "strike",
  effect: "This Character cannot attack unless there is a Character with 12000 base power or more.",
  effects: {
    permanentEffects: [
      {
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
              self: true,
            },
            duration: "permanent",
            condition: {
              condition: "compound",
              operator: "and",
              conditions: [
                {
                  condition: "notHasCard",
                  player: "self",
                  zone: "field",
                  filters: [
                    {
                      filter: "basePower",
                      comparison: "gte",
                      value: 12000,
                    },
                  ],
                },
                {
                  condition: "notHasCard",
                  player: "opponent",
                  zone: "field",
                  filters: [
                    {
                      filter: "basePower",
                      comparison: "gte",
                      value: 12000,
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

  i18n: eb04Emet051I18n,
};
