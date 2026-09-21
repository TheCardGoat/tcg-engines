import type { CharacterCard } from "@tcg/op-types";
import { op17BasilHawkins073I18n } from "./op17-073-basil-hawkins.i18n.ts";

export const op17BasilHawkins073: CharacterCard = {
  id: "OP17-073",
  canonicalId: "OP17-073",
  slug: "basil-hawkins/op17-073",
  name: "Basil Hawkins",
  printings: [
    {
      id: "OP17-073",
      artId: "OP17-073",
      setCode: "OP17",
      collectorNumber: "073",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-073_4Ll3kY5.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP17",
  cost: 3,
  power: 1000,
  counter: 2000,
  traits: ["Animal Kingdom Pirates Hawkins Pirates"],
  attribute: "slash",
  effect:
    "[On Play] You may trash 1 card from your hand: If your Leader has the {Animal Kingdom Pirates} type, add up to 1 DON!! card as active from your DON!! deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        optional: true,
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Animal Kingdom Pirates",
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
  i18n: op17BasilHawkins073I18n,
};
