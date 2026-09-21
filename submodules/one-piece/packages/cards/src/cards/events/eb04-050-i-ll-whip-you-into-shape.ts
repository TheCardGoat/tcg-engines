import type { EventCard } from "@tcg/op-types";
import { eb04ILlWhipYouIntoShape050I18n } from "./eb04-050-i-ll-whip-you-into-shape.i18n.ts";

export const eb04ILlWhipYouIntoShape050: EventCard = {
  id: "EB04-050",
  canonicalId: "EB04-050",
  slug: "i-ll-whip-you-into-shape/eb04-050",
  name: "I'll Whip You Into Shape.",
  printings: [
    {
      id: "EB04-050",
      artId: "EB04-050",
      setCode: "EB04",
      collectorNumber: "050",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-050_hjCxKaq.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "R",
  setId: "EB04",
  cost: 1,
  traits: ["Navy SWORD"],
  effect:
    "[Main] Up to 1 of your {SWORD} type Leader or Character cards can also attack active Characters during this turn.[Counter] Your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "canAttackActive",
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
                  value: "SWORD",
                  match: "includes",
                },
              ],
            },
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: eb04ILlWhipYouIntoShape050I18n,
};
