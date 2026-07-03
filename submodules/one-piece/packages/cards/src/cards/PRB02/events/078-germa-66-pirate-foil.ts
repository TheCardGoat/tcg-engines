import type { EventCard } from "@tcg/op-types";
import { prb02Germa66PirateFoil078I18n } from "./078-germa-66-pirate-foil.i18n.ts";

export const prb02Germa66PirateFoil078: EventCard = {
  id: "OP06-078",
  canonicalId: "OP06-078",
  slug: "germa-66-pirate-foil",
  name: "GERMA 66 (Pirate Foil)",
  printings: [
    {
      id: "OP06-078",
      artId: "OP06-078",
      setCode: "PRB02",
      collectorNumber: "078",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-078_p1.jpg",
    },
    {
      id: "OP06-078_r1",
      artId: "OP06-078_r1",
      setCode: "PRB02",
      collectorNumber: "078",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-078_r1.jpg",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "PRB02",
  cost: 1,
  traits: ["The Vinsmoke Family GERMA 66"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-078_r1.jpg",
      imageId: "OP06-078_r1",
    },
  ],
  effect:
    '[Main] Look at 5 cards from the top of your deck; reveal up to 1 card with a type including "GERMA" other than [GERMA 66] and add it to your hand. Then, place the rest at the bottom of your deck in any order.[Trigger] Draw 1 card.',
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "search",
            lookCount: 5,
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
                value: "GERMA 66",
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
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: prb02Germa66PirateFoil078I18n,
};
