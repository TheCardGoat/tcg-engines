import type { CharacterCard } from "@tcg/op-types";
import { eb02Crocodile023I18n } from "./023-crocodile.i18n.ts";

export const eb02Crocodile023: CharacterCard = {
  id: "EB02-023",
  canonicalId: "EB02-023",
  slug: "crocodile/eb02-023",
  name: "Crocodile",
  printings: [
    {
      id: "EB02-023",
      artId: "EB02-023",
      setCode: "EB02",
      collectorNumber: "023",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-023.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "EB02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Baroque Works The Seven Warlords of the Sea"],
  attribute: "special",
  effect:
    "[Your Turn] [Once Per Turn] When your opponent's Character is returned to the owner's hand by your effect, look at 3 cards from the top of your deck and place them at the top or bottom of the deck in any order.",
  effects: {
    effects: [
      {
        trigger: "whenLeaving",
        eventFilter: {
          player: "opponent",
          causedBy: "self",
          toZone: "hand",
        },
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 3,
            position: "topOrBottom",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb02Crocodile023I18n,
};
