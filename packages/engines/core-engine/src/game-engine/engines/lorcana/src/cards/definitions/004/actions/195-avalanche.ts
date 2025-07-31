import {
  chosenLocation,
  eachOpposingCharacter,
} from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const avalanche: LorcanaActionCardDefinition = {
  id: "znd",
  name: "Avalanche",
  characteristics: ["action"],
  text: "Deal 1 damage to each opposing character. You may banish chosen location.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "damage",
          amount: 1,
          target: eachOpposingCharacter,
        },
      ],
    },
    {
      type: "resolution",
      optional: true,
      effects: [
        {
          type: "banish",
          target: chosenLocation,
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
