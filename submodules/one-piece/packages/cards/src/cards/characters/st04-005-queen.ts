import type { CharacterCard } from "@tcg/op-types";
import { op08Queen005I18n } from "./st04-005-queen.i18n.ts";

export const op08Queen005: CharacterCard = {
  id: "ST04-005",
  canonicalId: "ST04-005",
  slug: "queen/st04-005",
  name: "Queen",
  printings: [
    {
      id: "ST04-005",
      artId: "ST04-005",
      setCode: "ST04",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST04-005.jpg",
    },
    {
      id: "ST04-005_p1",
      artId: "ST04-005_p1",
      setCode: "ST04",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST04-005_p1.jpg",
    },
    {
      id: "ST04-005_p3",
      artId: "ST04-005_p3",
      setCode: "ST04",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST04-005_p3.jpg",
      label: "Queen (Jolly Roger Foil)",
    },
    {
      id: "ST04-005_p4",
      artId: "ST04-005_p4",
      setCode: "ST04",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST04-005_p4.jpg",
    },
    {
      id: "ST04-005_r1",
      artId: "ST04-005_r1",
      setCode: "ST04",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST04-005_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST04",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Draw 2 cards and trash 1 card from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08Queen005I18n,
};
