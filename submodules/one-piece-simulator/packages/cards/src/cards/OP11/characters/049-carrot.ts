import type { CharacterCard } from "@tcg/op-types";
import { op11Carrot049I18n } from "./049-carrot.i18n.ts";

export const op11Carrot049: CharacterCard = {
  id: "OP11-049",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP11",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Minks"],
  attribute: "special",
  effect:
    "[On Play] Look at 3 cards from the top of your deck and place them at the top or bottom of the deck in any order.\n[On Your Opponent's Attack] You may trash this Character: Up to 1 of your Leader gains +1000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 3,
            position: "topOrBottom",
          },
        ],
      },
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op11Carrot049I18n,
};
