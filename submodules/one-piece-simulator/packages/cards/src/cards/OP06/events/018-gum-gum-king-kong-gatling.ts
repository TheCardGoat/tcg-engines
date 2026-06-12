import type { EventCard } from "@tcg/op-types";
import { op06GumGumKingKongGatling018I18n } from "./018-gum-gum-king-kong-gatling.i18n.ts";

export const op06GumGumKingKongGatling018: EventCard = {
  id: "OP06-018",
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "OP06",
  cost: 2,
  trigger: "K.O. up to 1 of your opponent's Characters with 5000 power or less.",
  traits: ["FILM Straw Hat Crew"],
  effect:
    "[Main] Up to 1 of your Leader or Character cards gains +3000 power during this turn. Then, if your opponent has a Character with 7000 power or more, up to 1 of your Leader or Character cards gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
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
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op06GumGumKingKongGatling018I18n,
};
