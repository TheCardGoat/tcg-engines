import type { CharacterCard } from "@tcg/op-types";
import { op02Minokoala086I18n } from "./086-minokoala.i18n.ts";

export const op02Minokoala086: CharacterCard = {
  id: "OP02-086",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Impel Down Jailer Beast"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-086_p1.jpg",
      imageId: "OP02-086_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On K.O.] If your Leader has the [Impel Down] type, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    keywords: ["blocker"],
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
  i18n: op02Minokoala086I18n,
};
