import type { CharacterCard } from "@tcg/op-types";
import { prb02HinaReprint008I18n } from "./008-hina-reprint.i18n.ts";

export const prb02HinaReprint008: CharacterCard = {
  id: "ST06-008",
  canonicalId: "ST06-008",
  slug: "hina-reprint",
  name: "Hina (Reprint)",
  printings: [
    {
      id: "ST06-008",
      artId: "ST06-008",
      setCode: "PRB02",
      collectorNumber: "008",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST06-008_r1.jpg",
    },
    {
      id: "ST06-008_p1",
      artId: "ST06-008_p1",
      setCode: "PRB02",
      collectorNumber: "008",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST06-008_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "PRB02",
  cost: 3,
  power: 5000,
  traits: ["Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST06-008_p1.jpg",
      imageId: "ST06-008_p1",
    },
  ],
  effect:
    '[On Play] Give up to 1 of your opponent\'s Characters -4 cost during this turn.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -4,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: prb02HinaReprint008I18n,
};
