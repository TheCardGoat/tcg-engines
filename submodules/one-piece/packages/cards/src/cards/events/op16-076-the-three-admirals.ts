import type { EventCard } from "@tcg/op-types";
import { op16TheThreeAdmirals076I18n } from "./op16-076-the-three-admirals.i18n.ts";

export const op16TheThreeAdmirals076: EventCard = {
  id: "OP16-076",
  canonicalId: "OP16-076",
  slug: "the-three-admirals/op16-076",
  name: "The Three Admirals!!",
  printings: [
    {
      id: "OP16-076",
      artId: "OP16-076",
      setCode: "OP16",
      collectorNumber: "076",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-076_koGM6JT.jpg",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "OP16",
  cost: 1,
  traits: ["Navy Admiral"],
  effect:
    "[Main] You may rest 3 of your DON!! cards: Up to 3 of your {Admiral} type Characters gain +2000 power during this turn.\n[Counter] If you have an {Admiral} type Character, up to 1 of your Leader or Character cards gains +4000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "restDon",
            amount: 3,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 3,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Admiral",
                  match: "includes",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op16TheThreeAdmirals076I18n,
};
