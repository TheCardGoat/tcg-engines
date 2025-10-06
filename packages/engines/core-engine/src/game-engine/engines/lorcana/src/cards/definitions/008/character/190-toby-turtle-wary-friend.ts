import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import { whileConditionThisCharacterGains } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tobyTurtleWaryFriend: LorcanaCharacterCardDefinition = {
  id: "cys",
  name: "Toby Turtle",
  title: "Wary Friend",
  characteristics: ["storyborn", "ally"],
  text: "HARD SHELL While this character is exerted, he gains Resist +1. (Damage dealt to them is reduced by 1.)",
  type: "character",
  abilities: [
    whileConditionThisCharacterGains({
      name: "HARD SHELL",
      text: "While this character is exerted, he gains Resist +1. (Damage dealt to them is reduced by 1.)",
      ability: resistAbility(1),
      conditions: [
        {
          type: "exerted",
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  strength: 0,
  willpower: 4,
  illustrator: "Irish Chua",
  number: 190,
  set: "008",
  rarity: "common",
  lore: 1,
};
