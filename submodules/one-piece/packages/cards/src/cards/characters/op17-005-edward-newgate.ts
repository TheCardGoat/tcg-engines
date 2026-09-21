import type { CharacterCard } from "@tcg/op-types";
import { op17EdwardNewgate005I18n } from "./op17-005-edward-newgate.i18n.ts";

export const op17EdwardNewgate005: CharacterCard = {
  id: "OP17-005",
  canonicalId: "OP17-005",
  slug: "edward-newgate/op17-005",
  name: "Edward.Newgate",
  printings: [
    {
      id: "OP17-005",
      artId: "OP17-005",
      setCode: "OP17",
      collectorNumber: "005",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-005_utvcUbv.jpg",
      label: "Edward.Newgate (005)",
    },
    {
      id: "OP17-005_p1",
      artId: "OP17-005_p2",
      setCode: "OP17",
      collectorNumber: "005",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-005_p2.jpg",
      label: "Edward.Newgate (005) (Manga)",
    },
    {
      id: "OP17-005_p2",
      artId: "OP17-005_p1",
      setCode: "OP17",
      collectorNumber: "005",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-005_p1_ieXdr61.jpg",
      label: "Edward.Newgate (005) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP17",
  cost: 10,
  power: 12000,
  traits: ["The Four Emperors Whitebeard Pirates"],
  attribute: "special",
  effect:
    "If your opponent has a Character with 10000 power or more, give this card in your hand -4 cost.\n[On Play] Your monocolored Leader's base power becomes 8000 until the end of your opponent's next End Phase.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "hasCard",
            player: "opponent",
            zone: "character",
            filters: [
              {
                filter: "power",
                comparison: "gte",
                value: 10000,
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
            value: -4,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op17EdwardNewgate005I18n,
};
