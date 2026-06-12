import type { CharacterCard } from "@tcg/op-types";
import { op13PortgasDRouge014I18n } from "./014-portgas-d-rouge.i18n.ts";

export const op13PortgasDRouge014: CharacterCard = {
  id: "OP13-014",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP13",
  cost: 1,
  power: 0,
  counter: 2000,
  trigger: "Up to 1 of your [Portgas.D.Ace] cards gains +3000 power during this turn.",
  traits: ["Baterilla"],
  attribute: "wisdom",
  effect: "[Trigger] Up to 1 of your [Portgas.D.Ace] cards gains +3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Portgas.D.Ace",
                },
              ],
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op13PortgasDRouge014I18n,
};
