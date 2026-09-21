import type { CharacterCard } from "@tcg/op-types";
import { op03Brannew089I18n } from "./op03-089-brannew.i18n.ts";

export const op03Brannew089: CharacterCard = {
  id: "OP03-089",
  canonicalId: "OP03-089",
  slug: "brannew",
  name: "Brannew",
  printings: [
    {
      id: "OP03-089",
      artId: "OP03-089",
      setCode: "OP03",
      collectorNumber: "089",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-089.jpg",
    },
    {
      id: "OP03-089_p4",
      artId: "OP03-089_p4",
      setCode: "OP03",
      collectorNumber: "089",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-089_p4.jpg",
      label: "Brannew (Jolly Roger Foil)",
    },
    {
      id: "OP03-089_p5",
      artId: "OP03-089_p5",
      setCode: "OP03",
      collectorNumber: "089",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-089_p5.jpg",
      label: "Brannew (Full Art)",
    },
    {
      id: "OP03-089_p6",
      artId: "OP03-089_p6",
      setCode: "OP03",
      collectorNumber: "089",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-089_p6.jpg",
      label: "Brannew (Alternate Art)",
    },
    {
      id: "OP03-089_r2",
      artId: "OP03-089_r2",
      setCode: "OP03",
      collectorNumber: "089",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-089_r2.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP03",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "wisdom",
  effect:
    "[On Play] Look at 3 cards from the top of your deck; reveal up to 1 [Navy] type card other than [Brannew] and add it to your hand. Then, trash the rest.",
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
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "trash",
          },
        ],
      },
    ],
  },
  i18n: op03Brannew089I18n,
};
