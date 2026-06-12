import type { CharacterCard } from "@tcg/op-types";
import { op03Tilestone064I18n } from "./064-tilestone.i18n.ts";

export const op03Tilestone064: CharacterCard = {
  id: "OP03-064",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP03",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Galley-La Company Water Seven"],
  attribute: "strike",
  effect:
    "[On K.O.] If your Leader has the [Galley-La Company] type, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Galley-La Company",
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
  i18n: op03Tilestone064I18n,
};
