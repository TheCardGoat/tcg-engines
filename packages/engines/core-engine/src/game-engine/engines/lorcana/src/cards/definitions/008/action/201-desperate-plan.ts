import {
  haveCardsInYourHand,
  haveNoCardsInYourHand,
} from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import type { CreateLayerBasedOnCondition } from "@lorcanito/lorcana-engine/effects/effectTypes";

const conditionalEffects: CreateLayerBasedOnCondition = {
  type: "create-layer-based-on-condition",
  // TODO: Target not needed
  target: self,
  conditionalEffects: [
    {
      conditions: [haveCardsInYourHand],
      effects: [
        {
          type: "discard",
          amount: 1, // THIS IS A PLACEHOLDER, the actual value lives in the target
          target: {
            type: "card",
            value: 99,
            upTo: true,
            filters: [
              { filter: "zone", value: "hand" },
              { filter: "owner", value: "self" },
            ],
          },
          forEach: [drawACard],
        },
      ],
    },
    {
      conditions: [haveNoCardsInYourHand],
      effects: [
        {
          type: "draw",
          amount: 3,
          target: {
            type: "player",
            value: "self",
          },
        },
      ],
    },
  ],
};

export const desperatePlan: LorcanitoActionCard = {
  id: "y5k",
  name: "Desperate Plan",
  characteristics: ["action"],
  text: "If you have no cards in your hand, draw until you have 3 cards in your hand. Otherwise, choose and discard any number of cards, then draw that many cards.",
  type: "action",
  inkwell: false,
  colors: ["steel"],
  cost: 3,
  illustrator: "Gianluca Barone",
  number: 201,
  set: "008",
  rarity: "rare",
  abilities: [
    {
      type: "resolution",
      effects: [conditionalEffects],
    },
  ],
};
