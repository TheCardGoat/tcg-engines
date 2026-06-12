import type { CharacterCard } from "@tcg/op-types";
import { op14eb04ScaledNeptunian011I18n } from "./011-scaled-neptunian.i18n.ts";

export const op14eb04ScaledNeptunian011: CharacterCard = {
  id: "EB04-011",
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
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 0,
          },
        ],
      },
    ],
  },
  i18n: op14eb04ScaledNeptunian011I18n,
};
