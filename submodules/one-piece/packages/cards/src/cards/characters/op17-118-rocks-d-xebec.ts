import type { CharacterCard } from "@tcg/op-types";
import { op17RocksDXebec118I18n } from "./op17-118-rocks-d-xebec.i18n.ts";

export const op17RocksDXebec118: CharacterCard = {
  id: "OP17-118",
  canonicalId: "OP17-118",
  slug: "rocks-d-xebec/op17-118",
  name: "Rocks.D.Xebec",
  printings: [
    {
      id: "OP17-118",
      artId: "OP17-118",
      setCode: "OP17",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-118_IQdoNTD.jpg",
      label: "Rocks.D.Xebec (118)",
    },
    {
      id: "OP17-118_p1",
      artId: "OP17-118_p2",
      setCode: "OP17",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-118_p2.jpg",
      label: "Rocks.D.Xebec (118) (Super Alternate Art)",
    },
    {
      id: "OP17-118_p2",
      artId: "OP17-118_p1",
      setCode: "OP17",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-118_p1_cGbVBNy.jpg",
      label: "Rocks.D.Xebec (118) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SEC",
  setId: "OP17",
  cost: 10,
  power: 12000,
  traits: ["Rocks Pirates"],
  attribute: "slash",
  effect:
    "If you only have Characters without a Counter, this card in your hand has a +2000 Counter.\n[On Play] Draw 1 card and play up to 2 {Rocks Pirates} type cards with different card names and a total cost of 9 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
              zone: "hand",
            },
            count: {
              amount: 2,
              upTo: true,
            },
            differentNames: true,
            totalConstraint: {
              property: "cost",
              comparison: "lte",
              value: 9,
            },
            filters: [
              {
                filter: "trait",
                value: "Rocks Pirates",
                match: "includes",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op17RocksDXebec118I18n,
};
