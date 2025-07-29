import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  discardCardEffect,
  getEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { chosenPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const suddenChill: LorcanaActionCardDefinition = {
  id: "pz4",
  name: "Sudden Chill",
  characteristics: ["action", "song"],
  text: "Each opponent chooses and discards a card.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn.",
      effects: [
        discardCardEffect({
          targets: [chosenPlayerTarget],
          value: 1,
        }),
        getEffect({
          targets: [chosenCharacterTarget],
          attribute: "strength",
          value: 2,
          duration: THIS_TURN,
        }),
      ],
    },
  ],
  flavour:
    "Cruella De Vil, Cruella De Vil \nIf she doesn't scare you, no evil thing will",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Giulia Riva",
  number: 98,
  set: "TFC",
  rarity: "common",
};
