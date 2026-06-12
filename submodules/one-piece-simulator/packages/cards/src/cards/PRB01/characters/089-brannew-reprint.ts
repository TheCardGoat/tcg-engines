import type { CharacterCard } from "@tcg/op-types";
import { prb01BrannewReprint089I18n } from "./089-brannew-reprint.i18n.ts";

export const prb01BrannewReprint089: CharacterCard = {
  id: "OP03-089",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "PRB01",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-089_p4.jpg",
      imageId: "OP03-089_p4",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-089_p5.jpg",
      imageId: "OP03-089_p5",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-089_p6.jpg",
      imageId: "OP03-089_p6",
    },
  ],
  effect:
    "[On Play] Look at 3 cards from the top of your deck; reveal up to 1 [Navy] type card other than [Brannew] and add it to your hand. Then, trash the rest.Disclaimer: This card was reprinted from the original set with changes to the artist credit (note the lack of pen symbol next to the artist name).",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                filter: "excludeName",
                value: "Brannew",
              },
              {
                filter: "trait",
                value: "Navy",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "trash",
          },
        ],
      },
    ],
  },
  i18n: prb01BrannewReprint089I18n,
};
