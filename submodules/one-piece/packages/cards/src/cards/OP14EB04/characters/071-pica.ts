import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Pica071I18n } from "./071-pica.i18n.ts";

export const op14eb04Pica071: CharacterCard = {
  id: "OP14-071",
  canonicalId: "OP14-071",
  slug: "pica/op14-071",
  name: "Pica",
  printings: [
    {
      id: "OP14-071",
      artId: "OP14-071",
      setCode: "OP14EB04",
      collectorNumber: "071",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-071_ReiDNW0.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "strike",
  effect:
    "[End of Your Turn] If your Leader has the {Donquixote Pirates} type, add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Donquixote Pirates",
            match: "includes",
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
      },
    ],
  },
  i18n: op14eb04Pica071I18n,
};
