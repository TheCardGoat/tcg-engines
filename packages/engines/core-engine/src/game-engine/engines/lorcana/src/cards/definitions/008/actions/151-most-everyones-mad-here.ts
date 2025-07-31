import type { DynamicValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import {
  banishEffect,
  gainLoreEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mostEveryonesMadHere: LorcanaActionCardDefinition = {
  id: "isu",
  name: "Most Everyone's Mad Here",
  characteristics: ["action"],
  text: "Gain lore equal to the damage on chosen character, then banish them.",
  type: "action",
  inkwell: false,
  colors: ["ruby"],
  cost: 7,
  illustrator: "Leonardo Giammichele",
  number: 151,
  set: "008",
  rarity: "rare",
  abilities: [
    {
      type: "static",
      text: "Gain lore equal to the damage on chosen character, then banish them.",
      targets: [chosenCharacterTarget],
      effects: [
        gainLoreEffect({
          targets: [selfPlayerTarget],
          value: {
            type: "targetDamage",
          } as DynamicValue,
          followedBy: banishEffect({
            targets: [chosenCharacterTarget],
          }),
        }),
      ],
    },
  ],
};
