import type { CharacterCard } from "@tcg/op-types";
import { eb03MissValentineMikita047I18n } from "./047-miss-valentine-mikita.i18n.ts";

export const eb03MissValentineMikita047: CharacterCard = {
  id: "EB03-047",
  canonicalId: "EB03-047",
  slug: "miss-valentine-mikita/eb03-047",
  name: "Miss.Valentine(Mikita)",
  printings: [
    {
      id: "EB03-047",
      artId: "EB03-047",
      setCode: "EB03",
      collectorNumber: "047",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-047_gbjVBb0.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "EB03",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "strike",
  effect: "[On Play] Trash 3 cards from the top of your deck.\n[On K.O.] Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 3,
          },
        ],
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: eb03MissValentineMikita047I18n,
};
