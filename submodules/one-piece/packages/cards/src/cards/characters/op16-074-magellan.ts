import type { CharacterCard } from "@tcg/op-types";
import { op16Magellan074I18n } from "./op16-074-magellan.i18n.ts";

export const op16Magellan074: CharacterCard = {
  id: "OP16-074",
  canonicalId: "OP16-074",
  slug: "magellan/op16-074",
  name: "Magellan",
  printings: [
    {
      id: "OP16-074",
      artId: "OP16-074",
      setCode: "OP16",
      collectorNumber: "074",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-074_PFe95iK.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP16",
  cost: 8,
  power: 10000,
  traits: ["Impel Down"],
  attribute: "special",
  effect:
    "[On Play] If your Leader has the {Impel Down} type, your opponent returns 1 DON!! card from their field to their DON!! deck.\n[On K.O.] Your opponent returns 4 DON!! cards from their field to their DON!! deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Impel Down",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "returnDon",
            player: "opponent",
            amount: 1,
          },
        ],
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "returnDon",
            player: "opponent",
            amount: 4,
          },
        ],
      },
    ],
  },
  i18n: op16Magellan074I18n,
};
