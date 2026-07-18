import type { EventCard } from "@tcg/op-types";
import { op04DonquixoteFamily036I18n } from "./036-donquixote-family.i18n.ts";

export const op04DonquixoteFamily036: EventCard = {
  id: "OP04-036",
  canonicalId: "OP04-036",
  slug: "donquixote-family",
  name: "Donquixote Family",
  printings: [
    {
      id: "OP04-036",
      artId: "OP04-036",
      setCode: "OP04",
      collectorNumber: "036",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-036.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP04",
  cost: 1,
  traits: ["Donquixote Pirates"],
  effect:
    "[Counter] Look at 5 cards from the top of your deck; reveal up to 1 [Donquixote Pirates] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order. [Trigger] Activate this card's [Counter] effect.",
  effects: {
    effects: [
      {
        trigger: "counter",
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
                value: "Donquixote Pirates",
                match: "includes",
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
            effectTrigger: "counter",
          },
        ],
      },
    ],
  },
  i18n: op04DonquixoteFamily036I18n,
};
