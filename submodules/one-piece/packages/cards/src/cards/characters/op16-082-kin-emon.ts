import type { CharacterCard } from "@tcg/op-types";
import { op16KinEmon082I18n } from "./op16-082-kin-emon.i18n.ts";

export const op16KinEmon082: CharacterCard = {
  id: "OP16-082",
  canonicalId: "OP16-082",
  slug: "kin-emon/op16-082",
  name: "Kin'emon",
  printings: [
    {
      id: "OP16-082",
      artId: "OP16-082",
      setCode: "OP16",
      collectorNumber: "082",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-082_ym7wiOG.jpg",
    },
    {
      id: "OP16-082_p1",
      artId: "OP16-082_p1",
      setCode: "OP16",
      collectorNumber: "082",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-082_p1_zfvdEUb.jpg",
      label: "Kin'emon (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP16",
  cost: 4,
  power: 6000,
  traits: ["Land of Wano The Akazaya Nine"],
  attribute: "slash",
  effect:
    "This Character gains +3 cost. [On Play] If your Leader has the {Land of Wano} type, look at 5 cards from the top of your deck; reveal up to 1 {Land of Wano} type card and add it to your hand. Then, trash the rest.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Land of Wano",
            match: "includes",
          },
        ],
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
                value: "Land of Wano",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "trash",
          },
        ],
      },
    ],
    permanentEffects: [
      {
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["hand", "character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 3,
          },
        ],
      },
    ],
  },
  i18n: op16KinEmon082I18n,
};
