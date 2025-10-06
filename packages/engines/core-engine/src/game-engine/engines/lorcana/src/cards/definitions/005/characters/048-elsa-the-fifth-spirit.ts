import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import {
  evasiveAbility,
  rushAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const elsaTheFifthSpirit: LorcanitoCharacterCardDefinition = {
  id: "pm7",
  name: "Elsa",
  title: "The Fifth Spirit",
  characteristics: ["hero", "dreamborn", "queen", "sorcerer"],
  text: "**Rush** _(This character can challenge the turn they’re played.)_   **Evasive** _(Only characters with Evasive can challenge this character.)_   **CRYSTALLIZE** When you play this character, exert chosen opposing character.",
  type: "character",
  abilities: [
    rushAbility,
    evasiveAbility,
    {
      type: "resolution",
      name: "CRYSTALLIZE",
      text: "When you play this character, exert chosen opposing character.",
      effects: [
        {
          type: "exert",
          exert: true,
          target: chosenOpposingCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 1,
  illustrator: "Lisanne Koeteeuw",
  number: 48,
  set: "SSK",
  rarity: "super_rare",
};
