import type { EventCard } from "@tcg/op-types";
import { prb02CrossGuildManga057I18n } from "./057-cross-guild-manga.i18n.ts";

export const prb02CrossGuildManga057: EventCard = {
  id: "OP09-057",
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "PRB02",
  cost: 1,
  traits: ["Cross Guild"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-057_r1_Ert5om6.jpg",
      imageId: "OP09-057_r1",
    },
  ],
  effect:
    '[Main] Look at 4 cards from the top of your deck; reveal up to 1 "Cross Guild" type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.[Trigger] Activate this card\'s [Main] effect.',
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "search",
            lookCount: 4,
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
                value: "Cross Guild",
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
  i18n: prb02CrossGuildManga057I18n,
};
