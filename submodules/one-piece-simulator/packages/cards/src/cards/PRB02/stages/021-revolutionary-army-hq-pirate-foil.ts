import type { StageCard } from "@tcg/op-types";
import { prb02RevolutionaryArmyHqPirateFoil021I18n } from "./021-revolutionary-army-hq-pirate-foil.i18n.ts";

export const prb02RevolutionaryArmyHqPirateFoil021: StageCard = {
  id: "OP05-021",
  cardType: "stage",
  color: ["red"],
  rarity: "UC",
  setId: "PRB02",
  cost: 1,
  traits: ["Revolutionary Army"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-021_r1.jpg",
      imageId: "OP05-021_r1",
    },
  ],
  effect:
    "[Activate:Main] You may trash 1 card from your hand and rest this Stage: Look at 3 cards from the top of your deck; reveal up to 1 [Revolutionary Army] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "search",
            lookCount: 3,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "trait",
                value: "Revolutionary Army",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb02RevolutionaryArmyHqPirateFoil021I18n,
};
