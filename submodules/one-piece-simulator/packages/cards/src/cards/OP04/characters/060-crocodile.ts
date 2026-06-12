import type { CharacterCard } from "@tcg/op-types";
import { op04Crocodile060I18n } from "./060-crocodile.i18n.ts";

export const op04Crocodile060: CharacterCard = {
  id: "OP04-060",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP04",
  cost: 8,
  power: 9000,
  traits: ["Baroque Works The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-060_p1.jpg",
      imageId: "OP04-060_p1",
    },
  ],
  effect:
    "[On Play] DON!! -2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader's type includes \"Baroque Works\", add up to 1 card from the top of your deck to the top of your Life cards. [On Your Opponent's Attack] [Once Per Turn] DON!! -1: Draw 1 card and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Baroque Works",
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
      },
      {
        trigger: "onOpponentAttack",
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
            amount: 1,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op04Crocodile060I18n,
};
