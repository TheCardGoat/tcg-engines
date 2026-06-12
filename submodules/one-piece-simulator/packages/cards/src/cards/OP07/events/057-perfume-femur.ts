import type { EventCard } from "@tcg/op-types";
import { op07PerfumeFemur057I18n } from "./057-perfume-femur.i18n.ts";

export const op07PerfumeFemur057: EventCard = {
  id: "OP07-057",
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "OP07",
  cost: 2,
  traits: ["Kuja Pirates The Seven Warlords of the Sea"],
  effect:
    "[Main] Select up to 1 of your [The Seven Warlords of the Sea] type Leader or Character cards and that card gains +2000 power during this turn. Then, if the selected card attacks during this turn, your opponent cannot activate [Blocker]. [Trigger] Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
          {
            action: "cannotActivate",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            keyword: "blocker",
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op07PerfumeFemur057I18n,
};
