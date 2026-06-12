import type { CharacterCard } from "@tcg/op-types";
import { eb01Minochihuahua036I18n } from "./036-minochihuahua.i18n.ts";

export const eb01Minochihuahua036: CharacterCard = {
  id: "EB01-036",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "EB01",
  cost: 4,
  power: 5000,
  traits: ["Baroque Works Impel Down Jailer Beast"],
  attribute: "strike",
  effect:
    "[Rush] (This card can attack on the turn in which it is played.)[On K.O.] If your Leader has the [Impel Down] type, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    keywords: ["rush"],
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Impel Down",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
    ],
  },
  i18n: eb01Minochihuahua036I18n,
};
