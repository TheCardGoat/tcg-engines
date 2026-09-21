import type { CharacterCard } from "@tcg/op-types";
import { prb02HinaReprint008I18n } from "./st06-008-hina-reprint.i18n.ts";

export const prb02HinaReprint008: CharacterCard = {
  id: "ST06-008",
  canonicalId: "ST06-008",
  slug: "hina-reprint",
  name: "Hina",
  printings: [
    {
      id: "ST06-008",
      artId: "ST06-008",
      setCode: "ST06",
      collectorNumber: "008",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST06-008_r1.jpg",
      label: "Hina (Reprint)",
    },
    {
      id: "ST06-008_p1",
      artId: "ST06-008_p1",
      setCode: "ST06",
      collectorNumber: "008",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST06-008_p1.jpg",
      label: "Hina (Pirate Foil)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST06",
  cost: 3,
  power: 5000,
  traits: ["Navy"],
  attribute: "special",
  effect: "[On Play] Give up to 1 of your opponent's Characters -4 cost during this turn.",
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
