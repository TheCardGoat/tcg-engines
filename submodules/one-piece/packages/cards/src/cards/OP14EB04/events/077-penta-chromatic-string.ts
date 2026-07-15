import type { EventCard } from "@tcg/op-types";
import { op14eb04PentaChromaticString077I18n } from "./077-penta-chromatic-string.i18n.ts";

export const op14eb04PentaChromaticString077: EventCard = {
  id: "OP14-077",
  canonicalId: "OP14-077",
  slug: "penta-chromatic-string",
  name: "Penta-Chromatic String",
  printings: [
    {
      id: "OP14-077",
      artId: "OP14-077",
      setCode: "OP14EB04",
      collectorNumber: "077",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-077_dLO1jjp.jpg",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 2,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, if your opponent has a Character with 6000 power or more, add up to 1 DON!! card from your DON!! deck and rest it.",
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
            value: 4000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op14eb04PentaChromaticString077I18n,
};
