import type { EventCard } from "@tcg/op-types";
import { op12CaptainsAssembled097I18n } from "./097-captains-assembled.i18n.ts";

export const op12CaptainsAssembled097: EventCard = {
  id: "OP12-097",
  canonicalId: "OP12-097",
  slug: "captains-assembled",
  name: "Captains Assembled",
  printings: [
    {
      id: "OP12-097",
      artId: "OP12-097",
      setCode: "OP12",
      collectorNumber: "097",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-097_ylCZoU2.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "R",
  setId: "OP12",
  cost: 1,
  trigger: "Activate this card's [Main] effect.",
  traits: ["Revolutionary Army"],
  effect:
    '[Main] Look at 3 cards from the top of your deck; reveal up to 1 "Revolutionary Army" type card other than [Captains Assembled] and add it to your hand. Then, trash the rest.',
  effects: {
    effects: [
      {
        trigger: "main",
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
                value: "Captains Assembled",
              },
              {
                filter: "trait",
                value: "Revolutionary Army",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "trash",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "main",
          },
        ],
      },
    ],
  },
  i18n: op12CaptainsAssembled097I18n,
};
