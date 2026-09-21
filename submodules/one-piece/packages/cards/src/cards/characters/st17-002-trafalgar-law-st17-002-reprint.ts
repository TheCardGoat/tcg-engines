import type { CharacterCard } from "@tcg/op-types";
import { prb02TrafalgarLawSt17002Reprint002I18n } from "./st17-002-trafalgar-law-st17-002-reprint.i18n.ts";

export const prb02TrafalgarLawSt17002Reprint002: CharacterCard = {
  id: "ST17-002",
  canonicalId: "ST17-002",
  slug: "trafalgar-law-st17-002-reprint",
  name: "Trafalgar Law",
  printings: [
    {
      id: "ST17-002",
      artId: "ST17-002",
      setCode: "ST17",
      collectorNumber: "002",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST17-002_r1.jpg",
      label: "Trafalgar Law - ST17-002 (Reprint)",
    },
    {
      id: "ST17-002_p1",
      artId: "ST17-002_p1",
      setCode: "ST17",
      collectorNumber: "002",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST17-002_p1.jpg",
      label: "Trafalgar Law - ST17-002 (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "ST17",
  cost: 4,
  power: 5000,
  traits: ["Heart Pirates The Seven Warlords of the Sea"],
  attribute: "slash",
  effect:
    "[On Play] You may return 1 of your Characters to the owner's hand: If your Leader has the \"The Seven Warlords of the Sea\" type, return up to 1 Character with a cost of 4 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnCharacter",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "any",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
            condition: {
              condition: "leaderTrait",
              trait: "The Seven Warlords of the Sea",
              match: "includes",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb02TrafalgarLawSt17002Reprint002I18n,
};
