import type { CharacterCard } from "@tcg/op-types";
import { prb01PortgasDAceManga013I18n } from "./013-portgas-d-ace-manga.i18n.ts";

export const prb01PortgasDAceManga013: CharacterCard = {
  id: "OP02-013",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "PRB01",
  cost: 7,
  power: 7000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  effect:
    "[On Play] Give up to 2 of your opponent's Characters -3000 power during this turn. Then, if your Leader's type includes \"Whitebeard Pirates\", this Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.)Disclaimer: This card was reprinted from the original set without the original textured foil.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: prb01PortgasDAceManga013I18n,
};
