import {
  resistAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import { whileConditionThisCharacterGains } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rhinoPowerHamster: LorcanaCharacterCardDefinition = {
  id: "x98",
  name: "Rhino",
  title: "Power Hamster",
  characteristics: ["floodborn", "ally"],
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Rhino.)\nEPIC BALL OF AWESOME While this character has no damage, he gains Resist +2. (Damage dealt to them is reduced by 2.)",
  type: "character",
  abilities: [
    shiftAbility(2, "Rhino"),
    whileConditionThisCharacterGains({
      name: "EPIC BALL OF AWESOME",
      text: "While this character has no damage, he gains Resist +2. (Damage dealt to them is reduced by 2.)",
      ability: resistAbility(2),
      conditions: [
        {
          type: "damage",
          comparison: { operator: "eq", value: 0 },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber", "steel"],
  cost: 4,
  strength: 4,
  willpower: 3,
  illustrator: "Leonardo Giammichele",
  number: 30,
  set: "008",
  rarity: "super_rare",
  lore: 2,
};
