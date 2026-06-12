import type { CharacterCard } from "@tcg/op-types";
import { op04Karoo004I18n } from "./004-karoo.i18n.ts";

export const op04Karoo004: CharacterCard = {
  id: "OP04-004",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP04",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Animal Alabasta"],
  attribute: "strike",
  effect:
    "[Activate:Main] You may rest this Character: Give up to 1 rested DON!! card to each of your [Alabasta] type Characters.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "Alabasta",
                },
              ],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op04Karoo004I18n,
};
