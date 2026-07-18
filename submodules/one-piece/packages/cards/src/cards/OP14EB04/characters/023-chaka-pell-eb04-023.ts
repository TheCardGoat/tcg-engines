import type { CharacterCard } from "@tcg/op-types";
import { op14eb04ChakaPellEb04023023I18n } from "./023-chaka-pell-eb04-023.i18n.ts";

export const op14eb04ChakaPellEb04023023: CharacterCard = {
  id: "EB04-023",
  canonicalId: "EB04-023",
  slug: "chaka-pell-eb04-023",
  name: "Chaka & Pell - EB04-023",
  printings: [
    {
      id: "EB04-023",
      artId: "EB04-023",
      setCode: "OP14EB04",
      collectorNumber: "023",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-023_YTYqVv6.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 8,
  power: 9000,
  traits: ["Alabasta"],
  attribute: "slash",
  effect:
    "[Double Attack] (This card deals 2 damage.)\n[On Play] You may give your active Leader -5000 power during this turn: Draw 2 cards.",
  effects: {
    keywords: ["doubleAttack"],
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "modifyLeaderPower",
            value: -5000,
            duration: "thisTurn",
            requiresActive: true,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04ChakaPellEb04023023I18n,
};
