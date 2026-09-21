import type { CharacterCard } from "@tcg/op-types";
import { op16AvaloPizarro102I18n } from "./op16-102-avalo-pizarro.i18n.ts";

export const op16AvaloPizarro102: CharacterCard = {
  id: "OP16-102",
  canonicalId: "OP16-102",
  slug: "avalo-pizarro/op16-102",
  name: "Avalo Pizarro",
  printings: [
    {
      id: "OP16-102",
      artId: "OP16-102",
      setCode: "OP16",
      collectorNumber: "102",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-102_ABhjlSm.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP16",
  cost: 1,
  power: 2000,
  counter: 2000,
  trigger: "Activate this card's [On K.O.] effect.",
  traits: ["Blackbeard Pirates Impel Down"],
  attribute: "special",
  effect: "[On K.O.] Draw 1 card, then play up to 1 [Fullalead] from your hand or trash.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
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
                filter: "name",
                value: "Fullalead",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op16AvaloPizarro102I18n,
};
