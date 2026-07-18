import type { EventCard } from "@tcg/op-types";
import { op10FoLlowMeAndIWillGuiDeYou059I18n } from "./059-fo-llow-me-and-i-will-gui-de-you.i18n.ts";

export const op10FoLlowMeAndIWillGuiDeYou059: EventCard = {
  id: "OP10-059",
  canonicalId: "OP10-059",
  slug: "fo-llow-me-and-i-will-gui-de-you",
  name: "Fo...llow...Me...and...I...Will...Gui...de...You",
  printings: [
    {
      id: "OP10-059",
      artId: "OP10-059",
      setCode: "OP10",
      collectorNumber: "059",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-059.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "OP10",
  cost: 1,
  trigger: "Activate this card's [Main] effect.",
  traits: ["Straw Hat Crew Dressrosa"],
  effect:
    '[Main] Look at 5 cards from the top of your deck; reveal up to 1 "Dressrosa" type Character card and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
                filter: "trait",
                value: "Dressrosa",
                match: "includes",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [{ action: "activateEffect", effectTrigger: "main" }],
      },
    ],
  },
  i18n: op10FoLlowMeAndIWillGuiDeYou059I18n,
};
