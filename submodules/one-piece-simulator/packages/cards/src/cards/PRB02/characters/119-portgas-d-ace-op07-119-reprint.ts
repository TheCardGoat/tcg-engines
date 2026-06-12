import type { CharacterCard } from "@tcg/op-types";
import { prb02PortgasDAceOp07119Reprint119I18n } from "./119-portgas-d-ace-op07-119-reprint.i18n.ts";

export const prb02PortgasDAceOp07119Reprint119: CharacterCard = {
  id: "OP07-119",
  cardType: "character",
  color: ["yellow"],
  rarity: "SEC",
  setId: "PRB02",
  cost: 10,
  power: 10000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  effect:
    '[On Play] Add up to 1 card from the top of your deck to the top of your Life cards. Then, if you have 2 or less Life cards, this Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.)Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
  i18n: prb02PortgasDAceOp07119Reprint119I18n,
};
