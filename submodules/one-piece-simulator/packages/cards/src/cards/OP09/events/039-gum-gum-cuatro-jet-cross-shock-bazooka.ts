import type { EventCard } from "@tcg/op-types";
import { op09GumGumCuatroJetCrossShockBazooka039I18n } from "./039-gum-gum-cuatro-jet-cross-shock-bazooka.i18n.ts";

export const op09GumGumCuatroJetCrossShockBazooka039: EventCard = {
  id: "OP09-039",
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "OP09",
  cost: 1,
  trigger: "K.O. up to 1 of your opponent's rested Characters with a cost of 4 or less.",
  traits: ["Straw Hat Crew Supernovas ODYSSEY"],
  effect:
    '[Counter] If your Leader has the "ODYSSEY" type and you have 2 or more rested Characters, up to 1 of your Leader or Character cards gains +2000 power during this turn.',
  effects: {
    effects: [
      {
        trigger: "counter",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "ODYSSEY",
              },
              {
                condition: "zoneCount",
                player: "self",
                zone: "character",
                comparison: "gte",
                value: 2,
                filters: [
                  {
                    filter: "state",
                    value: "rested",
                  },
                ],
              },
            ],
          },
        ],
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
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op09GumGumCuatroJetCrossShockBazooka039I18n,
};
