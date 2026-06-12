import type { CharacterCard } from "@tcg/op-types";
import { prb02RoronoaZoroOp09076076I18n } from "./076-roronoa-zoro-op09-076.i18n.ts";

export const prb02RoronoaZoroOp09076076: CharacterCard = {
  id: "OP09-076",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "PRB02",
  cost: 3,
  power: 5000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-076_p2.jpg",
      imageId: "OP09-076_p2",
    },
  ],
  effect:
    '[On Play] You may return 1 or more DON!! cards from your field to your DON!! deck: Add up to 1 DON!! card from your DON!! deck and set it as active.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb02RoronoaZoroOp09076076I18n,
};
