import type { EventCard } from "@tcg/op-types";
import { op13TheFiveEldersAreAtYourService096I18n } from "./096-the-five-elders-are-at-your-service.i18n.ts";

export const op13TheFiveEldersAreAtYourService096: EventCard = {
  id: "OP13-096",
  cardType: "event",
  color: ["black"],
  rarity: "R",
  setId: "OP13",
  cost: 1,
  trigger: "Activate this card's [Main] effect.",
  traits: ["Celestial Dragons Five Elders"],
  effect:
    '[Main] Look at 3 cards from the top of your deck; reveal up to 1 "Celestial Dragons" type card other than [The Five Elders Are at Your Service!!!] and add it to your hand. Then, trash the rest.',
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
                value: "The Five Elders Are at Your Service!!!",
              },
              {
                filter: "trait",
                value: "Celestial Dragons",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "trash",
          },
        ],
      },
    ],
  },
  i18n: op13TheFiveEldersAreAtYourService096I18n,
};
