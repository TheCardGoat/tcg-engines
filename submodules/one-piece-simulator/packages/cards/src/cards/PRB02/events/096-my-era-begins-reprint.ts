import type { EventCard } from "@tcg/op-types";
import { prb02MyEraBeginsReprint096I18n } from "./096-my-era-begins-reprint.i18n.ts";

export const prb02MyEraBeginsReprint096: EventCard = {
  id: "OP09-096",
  cardType: "event",
  color: ["black"],
  rarity: "R",
  setId: "PRB02",
  cost: 1,
  traits: ["Blackbeard Pirates"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-096_p1.jpg",
      imageId: "OP09-096_p1",
    },
  ],
  effect:
    '[Main] Look at 3 cards from the top of your deck; reveal up to 1 "Blackbeard Pirates" type card other than [My Era...Begins!!] and add it to your hand. Then, trash the rest.[Trigger] Activate this card\'s [Main] effect.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
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
                value: "My Era...Begins!!",
              },
              {
                filter: "trait",
                value: "Blackbeard Pirates",
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
  i18n: prb02MyEraBeginsReprint096I18n,
};
