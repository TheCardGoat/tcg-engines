import type { CharacterCard } from "@tcg/op-types";
import { op15Absalom079I18n } from "./op15-079-absalom.i18n.ts";

export const op15Absalom079: CharacterCard = {
  id: "OP15-079",
  canonicalId: "OP15-079",
  slug: "absalom/op15-079",
  name: "Absalom",
  printings: [
    {
      id: "OP15-079",
      artId: "OP15-079",
      setCode: "OP15",
      collectorNumber: "079",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-079_Uqa09kR.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP15",
  cost: 4,
  power: 5000,
  counter: 1000,
  trigger: "Activate this card's [On K.O.] effect.",
  traits: ["Thriller Bark Pirates"],
  attribute: "ranged",
  effect: "[On K.O.] Add up to 1 {Thriller Bark Pirates} type card from your trash to your hand.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Thriller Bark Pirates",
                  match: "includes",
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "onKo",
          },
        ],
      },
    ],
  },
  i18n: op15Absalom079I18n,
};
