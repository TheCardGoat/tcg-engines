import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  banishEffect,
  gainsAbilityEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenDamagedCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const walkThePlank: LorcanaActionCardDefinition = {
  id: "yl4",
  name: "Walk The Plank!",
  characteristics: ["action"],
  text: 'Your Pirate characters gain "{E} – Banish chosen damaged character" this turn.',
  type: "action",
  inkwell: false,
  colors: ["emerald", "steel"],
  cost: 3,
  illustrator: "Alberto Zermeno",
  number: 118,
  set: "008",
  rarity: "uncommon",
  abilities: [
    {
      type: "static",
      text: 'Your Pirate characters gain "{E} – Banish chosen damaged character" this turn.',
      targets: [
        {
          type: "card",
          cardType: "character",
          owner: "self",
          withClassification: "pirate",
        },
      ],
      effects: [
        gainsAbilityEffect({
          ability: {
            type: "activated",
            costs: { exert: true },
            effects: [
              banishEffect({ targets: [chosenDamagedCharacterTarget] }),
            ],
          },
          duration: THIS_TURN,
        }),
      ],
    },
  ],
};
