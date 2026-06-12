import type { EventCard } from "@tcg/op-types";
import { op10GumGumUfo020I18n } from "./020-gum-gum-ufo.i18n.ts";

export const op10GumGumUfo020: EventCard = {
  id: "OP10-020",
  cardType: "event",
  color: ["red"],
  rarity: "UC",
  setId: "OP10",
  cost: 2,
  trigger: "K.O. up to 1 of your opponent's Characters with 3000 power or less.",
  traits: ["Straw Hat Crew Punk Hazard"],
  effect:
    "[Main] Give up to 1 of your opponent's Characters 4000 power during this turn. Then, if you have 2 or less Life cards, up to 1 of your Leader or Character cards gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 4000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op10GumGumUfo020I18n,
};
