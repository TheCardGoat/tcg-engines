import type { CharacterCard } from "@tcg/op-types";
import { op16MarshallDTeach119I18n } from "./op16-119-marshall-d-teach.i18n.ts";

export const op16MarshallDTeach119: CharacterCard = {
  id: "OP16-119",
  canonicalId: "OP16-119",
  slug: "marshall-d-teach/op16-119",
  name: "Marshall.D.Teach",
  printings: [
    {
      id: "OP16-119",
      artId: "OP16-119",
      setCode: "OP16",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-119_48YgI3E.jpg",
      label: "Marshall.D.Teach (119)",
    },
    {
      id: "OP16-119_p1",
      artId: "OP16-119_p1",
      setCode: "OP16",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-119_p1_pI48EHO.jpg",
      label: "Marshall.D.Teach (119) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SEC",
  setId: "OP16",
  cost: 8,
  power: 10000,
  trigger:
    "Negate the effect of up to 1 of your opponent's Characters during this turn. Then, K.O. up to 1 of your opponent's Characters with a cost of 5 or less.",
  traits: ["Blackbeard Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  effect:
    "[On Play] Look at 3 cards from the top of your deck; add up to 1 card to the top of your Life cards. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
            revealDestination: "life",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op16MarshallDTeach119I18n,
};
