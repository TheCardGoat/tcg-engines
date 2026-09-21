import type { CharacterCard } from "@tcg/op-types";
import { op16BenevolentKingOfTheWaves071I18n } from "./op16-071-benevolent-king-of-the-waves.i18n.ts";

export const op16BenevolentKingOfTheWaves071: CharacterCard = {
  id: "OP16-071",
  canonicalId: "OP16-071",
  slug: "benevolent-king-of-the-waves/op16-071",
  name: "Benevolent King of the Waves",
  printings: [
    {
      id: "OP16-071",
      artId: "OP16-071",
      setCode: "OP16",
      collectorNumber: "071",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-071_TFe665j.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP16",
  cost: 3,
  power: 5000,
  traits: ["Navy"],
  attribute: "strike",
  effect:
    "[On Play] You may trash 1 card from your hand: Add up to 1 DON!! card from your DON!! deck and rest it.\n[On K.O.] Add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
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
        optional: true,
      },
      {
        trigger: "onKo",
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
  i18n: op16BenevolentKingOfTheWaves071I18n,
};
