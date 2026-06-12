import type { CharacterCard } from "@tcg/op-types";
import { prb02MonkeyDLuffyEb02061Reprint061I18n } from "./061-monkey-d-luffy-eb02-061-reprint.i18n.ts";

export const prb02MonkeyDLuffyEb02061Reprint061: CharacterCard = {
  id: "EB02-061",
  cardType: "character",
  color: ["purple"],
  rarity: "SEC",
  setId: "PRB02",
  cost: 6,
  power: 7000,
  traits: ["Straw Hat Crew Water Seven"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-061_r1.jpg",
      imageId: "EB02-061_r1",
    },
  ],
  effect:
    "If your Leader is multicolored and your opponent has 5 or more DON!! cards on their field, this Character gains [Rush].[When Attacking] [Once Per Turn] You may return 2 of your active DON!! cards to your DON!! deck: Set this Character as active. Then, add 1 card from the top of your Life cards to your hand.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
            },
            destination: "hand",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: prb02MonkeyDLuffyEb02061Reprint061I18n,
};
