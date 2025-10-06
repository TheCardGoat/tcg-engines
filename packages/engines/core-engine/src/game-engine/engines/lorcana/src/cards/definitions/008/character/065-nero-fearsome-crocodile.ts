import { moveDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect";
import {
  chosenOpposingCharacter,
  thisCharacter,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const neroFearsomeCrocodile: LorcanaCharacterCardDefinition = {
  id: "oz8",
  name: "Nero",
  title: "Fearsome Crocodile",
  characteristics: ["storyborn", "ally"],
  text: "AND MEAN {E} – Move 1 damage counter from this character to chosen opposing character.",
  type: "character",
  abilities: [
    {
      type: "activated",
      name: "AND MEAN",
      text: "{E} – Move 1 damage counter from this character to chosen opposing character.",
      costs: [{ type: "exert" }],
      effects: [
        moveDamageEffect({
          amount: 1,
          from: thisCharacter,
          to: chosenOpposingCharacter,
        }),
      ],
    },
  ],
  inkwell: false,
  colors: ["amethyst"],
  cost: 2,
  strength: 2,
  willpower: 3,
  illustrator: "Teresta Q.",
  number: 65,
  set: "008",
  rarity: "common",
  lore: 1,
};
