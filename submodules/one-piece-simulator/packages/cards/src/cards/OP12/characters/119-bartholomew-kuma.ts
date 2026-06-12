import type { CharacterCard } from "@tcg/op-types";
import { op12BartholomewKuma119I18n } from "./119-bartholomew-kuma.i18n.ts";

export const op12BartholomewKuma119: CharacterCard = {
  id: "OP12-119",
  cardType: "character",
  color: ["yellow"],
  rarity: "SEC",
  setId: "OP12",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Revolutionary Army The Seven Warlords of the Sea"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-119_p1_u0RIZJm.jpg",
      imageId: "OP12-119_p1",
    },
  ],
  effect:
    "[On Play] You may trash 1 card from your hand: Add up to 1 card from the top of your deck to the top of your Life cards. Then, this Character gains +2 cost until the end of your opponent's next End Phase.\n[Opponent's Turn] [On K.O.] Add up to 1 card from the top of your deck to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
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
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2,
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
        optional: true,
      },
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
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
    ],
  },
  i18n: op12BartholomewKuma119I18n,
};
