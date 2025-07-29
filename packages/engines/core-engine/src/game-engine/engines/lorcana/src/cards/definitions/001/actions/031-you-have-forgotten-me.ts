import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import type { DiscardEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";

export const youHaveForgottenMe: LorcanitoActionCard = {
  id: "z53",
  name: "You Have Forgotten Me",
  characteristics: ["action"],
  text: "Each opponent chooses and discards 2 cards.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "You Have Forgotten Me",
      text: "Each opponent chooses and discards two cards.",
      optional: false,
      responder: "opponent",
      effects: [
        {
          type: "discard",
          amount: 2,
          target: {
            type: "card",
            value: 2,
            filters: [
              { filter: "zone", value: "hand" },
              { filter: "owner", value: "self" },
            ],
          },
        } as DiscardEffect,
      ],
    },
  ],
  flavour: "You are more than what you have become. \n−Mufasa",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  illustrator: "Alice Pisoni",
  number: 31,
  set: "TFC",
  rarity: "uncommon",
};
