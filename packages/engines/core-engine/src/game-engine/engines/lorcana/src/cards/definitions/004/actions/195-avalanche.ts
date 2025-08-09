import { dealDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  allOpposingCharactersTarget,
  chosenLocationTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const avalanche: LorcanaActionCardDefinition = {
  id: "znd",
  name: "Avalanche",
  characteristics: ["action"],
  text: "Deal 1 damage to each opposing character. You may banish chosen location.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Deal 1 damage to each opposing character. You may banish chosen location.",
      effects: [
        dealDamageEffect({
          targets: [allOpposingCharactersTarget],
          value: 1,
        }),
        {
          type: "banish",
          targets: [chosenLocationTarget],
          optional: true,
        },
      ],
    },
  ],
  flavour: "A little snow never hurt anyone. That big rock, however...",
  colors: ["steel"],
  cost: 4,
  illustrator: "Justin Gerard",
  number: 195,
  set: "URR",
  rarity: "uncommon",
};
