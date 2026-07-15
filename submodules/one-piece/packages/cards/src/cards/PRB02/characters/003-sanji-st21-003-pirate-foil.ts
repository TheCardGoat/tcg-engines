import type { CharacterCard } from "@tcg/op-types";
import { prb02SanjiSt21003PirateFoil003I18n } from "./003-sanji-st21-003-pirate-foil.i18n.ts";

export const prb02SanjiSt21003PirateFoil003: CharacterCard = {
  id: "ST21-003",
  canonicalId: "ST21-003",
  slug: "sanji-st21-003-pirate-foil",
  name: "Sanji - ST21-003 (Pirate Foil)",
  printings: [
    {
      id: "ST21-003",
      artId: "ST21-003",
      setCode: "PRB02",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST21-003_p2.jpg",
    },
    {
      id: "ST21-003_r1",
      artId: "ST21-003_r1",
      setCode: "PRB02",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST21-003_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "PRB02",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST21-003_r1.jpg",
      imageId: "ST21-003_r1",
    },
  ],
  effect:
    "[On Play] Select up to 1 of your {Straw Hat Crew} type Characters with 6000 power or more. If the selected Character attacks during this turn, your opponent cannot activate [Blocker].",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "cannotActivate",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            keyword: "blocker",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: prb02SanjiSt21003PirateFoil003I18n,
};
