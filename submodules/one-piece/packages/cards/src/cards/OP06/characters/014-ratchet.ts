import type { CharacterCard } from "@tcg/op-types";
import { op06Ratchet014I18n } from "./014-ratchet.i18n.ts";

export const op06Ratchet014: CharacterCard = {
  id: "OP06-014",
  canonicalId: "OP06-014",
  slug: "ratchet",
  name: "Ratchet",
  printings: [
    {
      id: "OP06-014",
      artId: "OP06-014",
      setCode: "OP06",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-014.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP06",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["FILM Mecha Island"],
  attribute: "wisdom",
  effect:
    "[On Your Opponent's Attack] You may trash any number of [FILM] type cards from your hand. Your Leader or 1 of your Characters gains +1000 power during this battle for every card trashed.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        actions: [
          {
            action: "trashFromHand",
            player: "self",
            amount: 0,
            filters: [
              {
                filter: "trait",
                value: "FILM",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op06Ratchet014I18n,
};
