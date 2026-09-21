import type { StageCard } from "@tcg/op-types";
import { op06KingdomOfGerma079I18n } from "./op06-079-kingdom-of-germa.i18n.ts";

export const op06KingdomOfGerma079: StageCard = {
  id: "OP06-079",
  canonicalId: "OP06-079",
  slug: "kingdom-of-germa",
  name: "Kingdom of GERMA",
  printings: [
    {
      id: "OP06-079",
      artId: "OP06-079",
      setCode: "OP06",
      collectorNumber: "079",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-079.jpg",
    },
    {
      id: "OP06-079_p2",
      artId: "OP06-079_p2",
      setCode: "OP06",
      collectorNumber: "079",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-079_p2.jpg",
    },
    {
      id: "OP06-079_p3",
      artId: "OP06-079_p3",
      setCode: "OP06",
      collectorNumber: "079",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-079_p3.jpg",
      label: "Kingdom of GERMA (Textured Foil)",
    },
    {
      id: "OP06-079_p4",
      artId: "OP06-079_p4",
      setCode: "OP06",
      collectorNumber: "079",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-079_p4.jpg",
      label: "Kingdom of GERMA (Alternate Art)",
    },
    {
      id: "OP06-079_r1",
      artId: "OP06-079_r1",
      setCode: "OP06",
      collectorNumber: "079",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-079_r1.jpg",
    },
  ],
  cardType: "stage",
  color: ["purple"],
  rarity: "C",
  setId: "OP06",
  cost: 1,
  traits: ["Kingdom of GERMA"],
  effect:
    '[Activate:Main] You may trash 1 card from your hand and rest this Stage: Look at 3 cards from the top of your deck; reveal up to 1 card with a type including "GERMA" and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
          {
            cost: "restThisCard",
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
                value: "GERMA",
                match: "includes",
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
  i18n: op06KingdomOfGerma079I18n,
};
