import type { EventCard } from "@tcg/op-types";
import { prb01DonquixoteFamilyJollyRogerFoil036I18n } from "./036-donquixote-family-jolly-roger-foil.i18n.ts";

export const prb01DonquixoteFamilyJollyRogerFoil036: EventCard = {
  id: "OP04-036",
  canonicalId: "OP04-036",
  slug: "donquixote-family-jolly-roger-foil",
  name: "Donquixote Family (Jolly Roger Foil)",
  printings: [
    {
      id: "OP04-036",
      artId: "OP04-036",
      setCode: "PRB01",
      collectorNumber: "036",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-036_p2.jpg",
    },
    {
      id: "OP04-036_p3",
      artId: "OP04-036_p3",
      setCode: "PRB01",
      collectorNumber: "036",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-036_p3.jpg",
    },
    {
      id: "OP04-036_r1",
      artId: "OP04-036_r1",
      setCode: "PRB01",
      collectorNumber: "036",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-036_r1.png",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "PRB01",
  cost: 1,
  traits: ["Donquixote Pirates"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-036_p3.jpg",
      imageId: "OP04-036_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-036_r1.png",
      imageId: "OP04-036_r1",
    },
  ],
  effect:
    "[Counter] Look at 5 cards from the top of your deck; reveal up to 1 [Donquixote Pirates] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.[Trigger] Activate this card's [Counter] effect.",
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
  i18n: prb01DonquixoteFamilyJollyRogerFoil036I18n,
};
