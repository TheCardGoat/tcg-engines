import type { EventCard } from "@tcg/op-types";
import { prb02PlasticSurgeryShotSt12017PirateFoil017I18n } from "./st12-017-plastic-surgery-shot-st12-017-pirate-foil.i18n.ts";

export const prb02PlasticSurgeryShotSt12017PirateFoil017: EventCard = {
  id: "ST12-017",
  canonicalId: "ST12-017",
  slug: "plastic-surgery-shot-st12-017-pirate-foil",
  name: "Plastic Surgery Shot",
  printings: [
    {
      id: "ST12-017",
      artId: "ST12-017",
      setCode: "ST12",
      collectorNumber: "017",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST12-017_p1.jpg",
      label: "Plastic Surgery Shot - ST12-017 (Pirate Foil)",
    },
    {
      id: "ST12-017_r1",
      artId: "ST12-017_r1",
      setCode: "ST12",
      collectorNumber: "017",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST12-017_r1.jpg",
      label: "Plastic Surgery Shot - ST12-017 (Reprint)",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "ST12",
  cost: 1,
  traits: ["Straw Hat Crew"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, reveal 1 card from the top of your deck, play up to 1 Character card with a cost of 2, and place the rest at the top or bottom of your deck.",
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
            },
            value: 2000,
            duration: "thisBattle",
          },
          {
            action: "revealTopDeckCard",
            player: "self",
            conditional: {
              filters: [
                { filter: "cardCategory", value: "character" },
                { filter: "cost", comparison: "eq", value: 2 },
              ],
              actions: [
                {
                  action: "play",
                  source: { player: "self", zone: "deck" },
                  count: { amount: 1, upTo: true },
                  filters: [
                    { filter: "cardCategory", value: "character" },
                    { filter: "cost", comparison: "eq", value: 2 },
                  ],
                  topOnly: true,
                },
              ],
            },
            finalPosition: "choice",
          },
        ],
      },
    ],
  },
  i18n: prb02PlasticSurgeryShotSt12017PirateFoil017I18n,
};
