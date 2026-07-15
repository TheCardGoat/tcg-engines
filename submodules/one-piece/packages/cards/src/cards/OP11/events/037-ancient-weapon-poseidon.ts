import type { EventCard } from "@tcg/op-types";
import { op11AncientWeaponPoseidon037I18n } from "./037-ancient-weapon-poseidon.i18n.ts";

export const op11AncientWeaponPoseidon037: EventCard = {
  id: "OP11-037",
  canonicalId: "OP11-037",
  slug: "ancient-weapon-poseidon",
  name: "Ancient Weapon Poseidon",
  printings: [
    {
      id: "OP11-037",
      artId: "OP11-037",
      setCode: "OP11",
      collectorNumber: "037",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-037.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "UC",
  setId: "OP11",
  cost: 1,
  trigger: "Draw 1 card.",
  traits: ["Fish-Man Island"],
  effect:
    '[Main] Look at 4 cards from the top of your deck; reveal up to 1 "Neptunian" or "Fish-Man Island" type Character card and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "search",
            lookCount: 4,
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
                value: "Neptunian",
              },
              {
                filter: "trait",
                value: "Fish-Man Island",
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
    ],
  },
  i18n: op11AncientWeaponPoseidon037I18n,
};
