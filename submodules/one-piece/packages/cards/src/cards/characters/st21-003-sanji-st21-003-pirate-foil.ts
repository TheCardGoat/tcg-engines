import type { CharacterCard } from "@tcg/op-types";
import { prb02SanjiSt21003PirateFoil003I18n } from "./st21-003-sanji-st21-003-pirate-foil.i18n.ts";

export const prb02SanjiSt21003PirateFoil003: CharacterCard = {
  id: "ST21-003",
  canonicalId: "ST21-003",
  slug: "sanji-st21-003-pirate-foil",
  name: "Sanji",
  printings: [
    {
      id: "ST21-003",
      artId: "ST21-003",
      setCode: "ST21",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST21-003_p2.jpg",
      label: "Sanji - ST21-003 (Pirate Foil)",
    },
    {
      id: "ST21-003_r1",
      artId: "ST21-003_r1",
      setCode: "ST21",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST21-003_r1.jpg",
      label: "Sanji - ST21-003 (Reprint)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST21",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[On Play] Select up to 1 of your {Straw Hat Crew} type Characters with 6000 power or more. If the selected Character attacks during this turn, your opponent cannot activate [Blocker].",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Straw Hat Crew",
                  match: "includes",
                },
                {
                  filter: "power",
                  comparison: "gte",
                  value: 6000,
                },
              ],
            },
            keyword: "unblockable",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: prb02SanjiSt21003PirateFoil003I18n,
};
