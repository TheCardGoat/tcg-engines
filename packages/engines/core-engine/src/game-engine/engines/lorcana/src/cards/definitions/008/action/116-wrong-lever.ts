import type {
  CardEffectTarget,
  LorcanitoActionCard,
} from "@lorcanito/lorcana-engine";
import {
  chosenCharacter,
  thisCharacter,
} from "@lorcanito/lorcana-engine/abilities/targets";
import type {
  CreateLayerBasedOnTarget,
  MoveCardEffect,
} from "@lorcanito/lorcana-engine/effects/effectTypes.ts";

const putChosenCharAtTheBottom: CreateLayerBasedOnTarget = {
  type: "create-layer-based-on-target",
  // TODO: get rid of target
  target: thisCharacter,
  responder: "self",
  effects: [
    {
      type: "move",
      to: "deck",
      bottom: true,
      shouldRevealMoved: true,
      target: chosenCharacter,
    },
  ],
};

const pullTheLeverFromDiscard: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "discard" },
    { filter: "owner", value: "self" },
    {
      filter: "publicId",
      // value: pullTheLever.id,
      value: "sp7",
    },
  ],
};

const putAPullTheLeverFromDiscardToBottom: MoveCardEffect = {
  type: "move",
  to: "deck",
  bottom: true,
  amount: 1,
  shouldRevealMoved: true,
  target: pullTheLeverFromDiscard,
  forEach: [putChosenCharAtTheBottom],
};

export const wrongLeverAction: LorcanitoActionCard = {
  id: "g9i",
  name: "Wrong Lever!",
  characteristics: ["action"],
  text: "Choose one:\n- Return chosen character to their player's hand.\n- Put a Pull the Lever! card from your discard pile on the bottom of your deck to put chosen character on the bottom of their owner's deck.",
  type: "action",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  illustrator: "Cristian Romero",
  number: 116,
  set: "008",
  rarity: "rare",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "modal",
          // TODO: Get rid of target
          target: chosenCharacter,
          modes: [
            {
              id: "1",
              text: "Return chosen character to their player's hand.",
              effects: [{ type: "move", to: "hand", target: chosenCharacter }],
            },
            {
              id: "2",
              text: "Put a Pull the Lever! card from your discard pile on the bottom of your deck to put chosen character on the bottom of their owner's deck.",
              effects: [putAPullTheLeverFromDiscardToBottom],
            },
          ],
        },
      ],
    },
  ],
};
