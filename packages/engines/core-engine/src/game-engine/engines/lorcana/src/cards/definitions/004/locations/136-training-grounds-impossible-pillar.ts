import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";

export const trainingGroundsImpossiblePillar: LorcanaLocationCardDefinition = {
  id: "c0i",
  missingTestCase: true,
  name: "Training Grounds",
  title: "Impossible Pillar",
  characteristics: ["location"],
  text: "**STRENGTH OF MIND** 1 {I} - Chosen character here gets +1 {S} this turn.",
  type: "location",
  abilities: [
    {
      type: "activated",
      costs: [{ type: "ink", amount: 1 }],
      text: "Strength of Mind",
      name: "1 {I} - Chosen character here gets +1 {S} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 1,
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  moveCost: 1,
  willpower: 5,
  illustrator: "Matthew Oates",
  number: 136,
  set: "URR",
  rarity: "common",
};
