import type { CharacterCard } from "@tcg/op-types";
import { op13TonyTonyChopper030I18n } from "./030-tony-tony-chopper.i18n.ts";

export const op13TonyTonyChopper030: CharacterCard = {
  id: "OP13-030",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP13",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Animal FILM Straw Hat Crew"],
  attribute: "strike",
  effect: "[On Play] Set up to 2 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op13TonyTonyChopper030I18n,
};
