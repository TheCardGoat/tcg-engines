import type { CharacterCard } from "@tcg/op-types";
import { op09EustassCaptainKid075I18n } from "./075-eustass-captain-kid.i18n.ts";

export const op09EustassCaptainKid075: CharacterCard = {
  id: "OP09-075",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP09",
  cost: 3,
  power: 5000,
  traits: ["Kid Pirates"],
  attribute: "special",
  effect:
    '[On Play] You may add 1 card from the top of your Life cards to your hand: If your Leader has the "Kid Pirates" type, add up to 1 DON!! card from your DON!! deck and set it as active.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Kid Pirates",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09EustassCaptainKid075I18n,
};
