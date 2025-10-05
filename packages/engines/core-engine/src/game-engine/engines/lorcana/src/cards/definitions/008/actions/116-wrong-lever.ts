import {
  modalEffect,
  putCardEffect,
  returnCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  cardNamedTarget,
  chosenCharacterTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const wrongLeverAction: LorcanaActionCardDefinition = {
  id: "g9i",
  name: "Wrong Lever!",
  characteristics: ["action"],
  text: "Choose one:\n- Return chosen character to their player's hand.\n- Put a Pull the Lever! card from your discard pile on the bottom of your deck to put chosen character on the bottom of their owner's deck.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Choose one:\n- Return chosen character to their player's hand.\n- Put a Pull the Lever! card from your discard pile on the bottom of your deck to put chosen character on the bottom of their owner's deck.",
      effects: [
        modalEffect([
          {
            text: "Return chosen character to their player's hand.",
            effects: [
              returnCardEffect({
                to: "hand",
                targets: [chosenCharacterTarget],
              }),
            ],
          },
          {
            text: "Put a Pull the Lever! card from your discard pile on the bottom of your deck to put chosen character on the bottom of their owner's deck.",
            effects: [
              putCardEffect({
                to: "deck",
                from: "discard",
                position: "bottom",
                targets: [cardNamedTarget({ name: "Pull The Lever!" })],
                followedBy: putCardEffect({
                  to: "deck",
                  from: "play",
                  position: "bottom",
                  targets: [chosenCharacterTarget],
                }),
              }),
            ],
          },
        ]),
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  illustrator: "Cristian Romero",
  number: 116,
  set: "008",
  rarity: "rare",
};
