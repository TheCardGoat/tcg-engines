import type { CharacterCard } from "@tcg/op-types";
import { prb02PortgasDAcePrb02018018I18n } from "./018-portgas-d-ace-prb02-018.i18n.ts";

export const prb02PortgasDAcePrb02018018: CharacterCard = {
  id: "PRB02-018",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "PRB02",
  cost: 5,
  power: 7000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-018_p1.jpg",
      imageId: "PRB02-018_p1",
    },
  ],
  effect:
    "[On Play] If you have a face-up Life card, play up to 1 [Sabo], [Portgas.D.Ace], or [Monkey.D.Luffy] with a cost of 2 from your hand or trash.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "faceUpLife",
            player: "self",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: ["hand", "trash"],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 2,
              },
              {
                filter: "name",
                value: "Sabo",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: prb02PortgasDAcePrb02018018I18n,
};
