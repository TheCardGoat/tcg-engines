import type { CharacterCard } from "@tcg/op-types";
import { op03Minorhinoceros069I18n } from "./069-minorhinoceros.i18n.ts";

export const op03Minorhinoceros069: CharacterCard = {
  id: "OP03-069",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP03",
  cost: 3,
  power: 5000,
  traits: ["Impel Down Jailer Beast"],
  attribute: "strike",
  effect:
    "[On K.O.] If your Leader has the [Impel Down] type, draw 2 cards and trash 1 card from your hand.",
  effects: {
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
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op03Minorhinoceros069I18n,
};
