import type { CharacterCard } from "@tcg/op-types";
import { prb02SanGorouPirateFoil003I18n } from "./003-san-gorou-pirate-foil.i18n.ts";

export const prb02SanGorouPirateFoil003: CharacterCard = {
  id: "ST18-003",
  canonicalId: "ST18-003",
  slug: "san-gorou-pirate-foil",
  name: "San-Gorou (Pirate Foil)",
  printings: [
    {
      id: "ST18-003",
      artId: "ST18-003",
      setCode: "PRB02",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST18-003_p2.jpg",
    },
    {
      id: "ST18-003_r1",
      artId: "ST18-003_r1",
      setCode: "PRB02",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST18-003_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "PRB02",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST18-003_r1.jpg",
      imageId: "ST18-003_r1",
    },
  ],
  effect:
    "[When Attacking] [Once Per Turn] If you have 8 or more DON!! cards on your field, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 8,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: prb02SanGorouPirateFoil003I18n,
};
