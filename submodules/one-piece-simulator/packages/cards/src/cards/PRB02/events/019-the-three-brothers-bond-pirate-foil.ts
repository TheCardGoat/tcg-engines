import type { EventCard } from "@tcg/op-types";
import { prb02TheThreeBrothersBondPirateFoil019I18n } from "./019-the-three-brothers-bond-pirate-foil.i18n.ts";

export const prb02TheThreeBrothersBondPirateFoil019: EventCard = {
  id: "ST13-019",
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "PRB02",
  cost: 1,
  traits: ["Goa Kingdom"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST13-019_r1.jpg",
      imageId: "ST13-019_r1",
    },
  ],
  effect:
    "[Main] Look at 5 cards from the top of your deck; reveal up to 1 [Sabo], [Portgas.D.Ace], or [Monkey.D.Luffy] with a cost of 5 or less and add it to your hand. Then, place the rest at the bottom of your deck in any order.[Trigger] Activate this card's [Main] effect.",
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
                filter: "cost",
                comparison: "lte",
                value: 5,
              },
              {
                filter: "name",
                value: "Sabo",
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
  i18n: prb02TheThreeBrothersBondPirateFoil019I18n,
};
