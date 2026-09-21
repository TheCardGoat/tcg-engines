import type { CharacterCard } from "@tcg/op-types";
import { prb02SanGorouPirateFoil003I18n } from "./st18-003-san-gorou-pirate-foil.i18n.ts";

export const prb02SanGorouPirateFoil003: CharacterCard = {
  id: "ST18-003",
  canonicalId: "ST18-003",
  slug: "san-gorou-pirate-foil",
  name: "San-Gorou",
  printings: [
    {
      id: "ST18-003",
      artId: "ST18-003",
      setCode: "ST18",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST18-003_p2.jpg",
      label: "San-Gorou (Pirate Foil)",
    },
    {
      id: "ST18-003_r1",
      artId: "ST18-003_r1",
      setCode: "ST18",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST18-003_r1.jpg",
      label: "San-Gorou (Reprint)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST18",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
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
