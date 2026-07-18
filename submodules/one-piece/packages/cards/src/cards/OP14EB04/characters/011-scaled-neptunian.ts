import type { CharacterCard } from "@tcg/op-types";
import { op14eb04ScaledNeptunian011I18n } from "./011-scaled-neptunian.i18n.ts";

export const op14eb04ScaledNeptunian011: CharacterCard = {
  id: "EB04-011",
  canonicalId: "EB04-011",
  slug: "scaled-neptunian/eb04-011",
  name: "Scaled Neptunian",
  printings: [
    {
      id: "EB04-011",
      artId: "EB04-011",
      setCode: "OP14EB04",
      collectorNumber: "011",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-011_7gq89MM.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 7,
  power: 8000,
  counter: 1000,
  traits: ["Neptunian"],
  attribute: "strike",
  effect:
    "[Rush: Character] (This card can attack Characters on the turn in which it is played.)\n[On Play] Draw a card for each of your {Neptunian} type Characters. Then, trash the same number of cards from your hand.",
  effects: {
    keywords: ["rushCharacter"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 0,
            amountFromTarget: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "Neptunian",
                  match: "includes",
                },
              ],
            },
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 0,
            amountFromPreviousActionTargets: true,
          },
        ],
      },
    ],
  },
  i18n: op14eb04ScaledNeptunian011I18n,
};
