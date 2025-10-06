import {
  chosenOtherCharacterOfYours,
  self,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const camiloMadrigalFamilyCopycat: LorcanaCharacterCardDefinition = {
  id: "oxz",
  name: "Camilo Madrigal",
  title: "Family Copycat",
  characteristics: ["storyborn", "ally", "madrigal"],
  text: "**IMITATE** Whenever this character quests, you may gain lore equal to the {L} of chosen other character of yours. Return that character to your hand.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "**IMITATE**",
      text: "Whenever this character quests, you may gain lore equal to the {L} of chosen other character of yours. Return that character to your hand.",
      optional: true,
      dependentEffects: true,
      effects: [
        {
          type: "move",
          to: "hand",
          amount: 1,
          target: chosenOtherCharacterOfYours,
        },
        {
          type: "lore",
          modifier: "add",
          target: self,
          amount: {
            dynamic: true,
            target: { attribute: "lore" },
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 6,
  strength: 3,
  willpower: 7,
  lore: 1,
  illustrator: "Saulo Nate",
  number: 58,
  set: "SSK",
  rarity: "legendary",
};
