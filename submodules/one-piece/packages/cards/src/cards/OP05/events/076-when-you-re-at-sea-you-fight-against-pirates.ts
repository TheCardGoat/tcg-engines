import type { EventCard } from "@tcg/op-types";
import { op05WhenYouReAtSeaYouFightAgainstPirates076I18n } from "./076-when-you-re-at-sea-you-fight-against-pirates.i18n.ts";

export const op05WhenYouReAtSeaYouFightAgainstPirates076: EventCard = {
  id: "OP05-076",
  canonicalId: "OP05-076",
  slug: "when-you-re-at-sea-you-fight-against-pirates",
  name: "When You're at Sea You Fight against Pirates!!",
  printings: [
    {
      id: "OP05-076",
      artId: "OP05-076",
      setCode: "OP05",
      collectorNumber: "076",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-076.jpg",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "OP05",
  cost: 1,
  traits: ["Land of Wano"],
  effect:
    "[Main] Look at 3 cards from the top of your deck; reveal up to 1 [Straw Hat Crew], [Kid Pirates], or [Heart Pirates] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order. [Trigger] Activate this card's [Main] effect.",
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
                filter: "anyOf",
                filters: [
                  {
                    filter: "trait",
                    value: "Straw Hat Crew",
                    match: "includes",
                  },
                  {
                    filter: "trait",
                    value: "Kid Pirates",
                    match: "includes",
                  },
                  {
                    filter: "trait",
                    value: "Heart Pirates",
                    match: "includes",
                  },
                ],
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
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
  i18n: op05WhenYouReAtSeaYouFightAgainstPirates076I18n,
};
