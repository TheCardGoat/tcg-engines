import type { EventCard } from "@tcg/op-types";
import { op11IMGonnaBeANavyOfficer099I18n } from "./099-i-m-gonna-be-a-navy-officer.i18n.ts";

export const op11IMGonnaBeANavyOfficer099: EventCard = {
  id: "OP11-099",
  canonicalId: "OP11-099",
  slug: "i-m-gonna-be-a-navy-officer",
  name: "I'm Gonna Be a Navy Officer!!!",
  printings: [
    {
      id: "OP11-099",
      artId: "OP11-099",
      setCode: "OP11",
      collectorNumber: "099",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-099.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "R",
  setId: "OP11",
  cost: 1,
  trigger: "Activate this card's [Main] effect.",
  traits: ["Navy East Blue"],
  effect:
    '[Main] Look at 3 cards from the top of your deck; reveal up to 1 "Navy" type card other than [I\'m Gonna Be a Navy Officer!!!] and add it to your hand. Then, trash the rest.',
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
                value: "I'm Gonna Be a Navy Officer!!!",
              },
              {
                filter: "trait",
                value: "Navy",
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
  i18n: op11IMGonnaBeANavyOfficer099I18n,
};
