import { anotherChosenCharOfYours } from "~/game-engine/engines/lorcana/src/abilities/target";
import { self } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const arthurWizardsApprentice: LorcanaCharacterCardDefinition = {
  id: "rvh",
  name: "Arthur",
  title: "Wizard's Apprentice",
  characteristics: ["hero", "dreamborn", "sorcerer"],
  text: "**STUDENT** Whenever this character quests, you may return another chosen character of yours to your hand to gain 2 lore.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "Student",
      text: "Whenever this character quests, you may return another chosen character of yours to your hand to gain 2 lore.",
      dependentEffects: true,
      optional: true,
      effects: [
        {
          type: "move",
          to: "hand",
          target: anotherChosenCharOfYours,
        },
        {
          type: "lore",
          modifier: "add",
          amount: 2,
          target: self,
        },
      ],
    }),
  ],
  flavour: "Hmm . . what spell should I try next?",
  colors: ["amethyst"],
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Jake Parker",
  number: 35,
  set: "ROF",
  rarity: "super_rare",
};
