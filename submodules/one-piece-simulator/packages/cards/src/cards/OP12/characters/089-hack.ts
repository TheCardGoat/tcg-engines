import type { CharacterCard } from "@tcg/op-types";
import { op12Hack089I18n } from "./089-hack.i18n.ts";

export const op12Hack089: CharacterCard = {
  id: "OP12-089",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP12",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Fish-Man Revolutionary Army Dressrosa"],
  attribute: "strike",
  effect:
    'If your Leader has the "Revolutionary Army" type, this Character gains [Blocker] and +4 cost.\n[On K.O.] If your Leader has the "Revolutionary Army" type, K.O. up to 1 of your opponent\'s Characters with a base cost of 4 or less.',
  effects: {
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Revolutionary Army",
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "baseCost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op12Hack089I18n,
};
