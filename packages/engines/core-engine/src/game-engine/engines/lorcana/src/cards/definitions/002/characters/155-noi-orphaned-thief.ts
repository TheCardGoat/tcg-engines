import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
import {
  resistAbility,
  wardAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import { itemsYouControl } from "~/game-engine/engines/lorcana/src/abilities/target";
import { whileConditionThisCharacterGains } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const noiWhileCondition: Condition[] = [
  {
    type: "filter",
    filters: itemsYouControl,
    comparison: {
      operator: "gte",
      value: 1,
    },
  },
];

export const noiOrphanedThief: LorcanaCharacterCardDefinition = {
  id: "r77",
  name: "Noi",
  title: "Orphaned Thief",
  characteristics: ["storyborn", "ally"],
  text: "**HIDE AND SEEK** While you have an item in play, this character gains **Resist** +1 and **Ward**. _(Damage dealt to this character is reduced by 1. Opponents can't choose this character except to challenge.)_",
  type: "character",
  abilities: [
    whileConditionThisCharacterGains({
      name: "HIDE AND SEEK",
      text: "While you have an item in play, this character gains **Ward**.",
      conditions: noiWhileCondition,
      ability: wardAbility,
    }),
    whileConditionThisCharacterGains({
      name: "HIDE AND SEEK",
      text: " While you have an item in play, this character gains **Resist** +1.",
      conditions: noiWhileCondition,
      ability: resistAbility(1),
    }),
  ],
  illustrator: "Kristina Chouri",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  lore: 2,
  strength: 1,
  willpower: 2,
  number: 155,
  set: "ROF",
  rarity: "rare",
};
