import type { CharacterCard } from "@tcg/op-types";
import { op16DraculeMihawk089I18n } from "./op16-089-dracule-mihawk.i18n.ts";

export const op16DraculeMihawk089: CharacterCard = {
  id: "OP16-089",
  canonicalId: "OP16-089",
  slug: "dracule-mihawk/op16-089",
  name: "Dracule Mihawk",
  printings: [
    {
      id: "OP16-089",
      artId: "OP16-089",
      setCode: "OP16",
      collectorNumber: "089",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-089_YGozAl4.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP16",
  cost: 6,
  power: 8000,
  traits: ["The Seven Warlords of the Sea"],
  attribute: "slash",
  effect:
    "[Rush: Character] (This card can attack Characters on the turn in which it is played.)\n[On Play] Draw 2 cards and trash 2 cards from your hand. Then, give up to 1 of your opponent's Characters 4 cost during this turn.",
  effects: {
    keywords: ["rushCharacter"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 4,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op16DraculeMihawk089I18n,
};
