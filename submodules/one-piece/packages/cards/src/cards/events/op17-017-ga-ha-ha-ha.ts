import type { EventCard } from "@tcg/op-types";
import { op17GaHaHaHa017I18n } from "./op17-017-ga-ha-ha-ha.i18n.ts";

export const op17GaHaHaHa017: EventCard = {
  id: "OP17-017",
  canonicalId: "OP17-017",
  slug: "ga-ha-ha-ha/op17-017",
  name: "Ga Ha Ha Ha!!",
  printings: [
    {
      id: "OP17-017",
      artId: "OP17-017",
      setCode: "OP17",
      collectorNumber: "017",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-017_d0fhw4t.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "OP17",
  cost: 1,
  traits: ["The Four Emperors Whitebeard Pirates"],
  effect:
    '[Counter] Up to 1 of your Leader with a type including "Whitebeard Pirates" or up to 1 of your Characters with a type including "Whitebeard Pirates" gains +2000 power during this battle. Then, give up to 1 of your opponent\'s Leader or Characters 2000 power during this turn.',
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Whitebeard Pirates",
                  match: "includes",
                },
              ],
            },
            value: 2000,
            duration: "thisBattle",
          },
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op17GaHaHaHa017I18n,
};
