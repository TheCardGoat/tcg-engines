import { allYourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const liShangArcheryInstructor: LorcanaCharacterCardDefinition = {
  id: "vg7",

  name: "Li Shang",
  title: "Archery Instructor",
  characteristics: ["hero", "storyborn"],
  text: "**ARCHERY LESSON** Whenever this character quests, your characters gain **Evasive** this turn. _(They can challenge characters with Evasive.)_",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "Archery Lesson",
      text: "Whenever this character quests, your characters gain **Evasive** this turn.",
      effects: [
        {
          type: "ability",
          ability: "evasive",
          modifier: "add",
          duration: "turn",
          target: allYourCharacters,
        } as AbilityEffect,
      ],
    }),
  ],
  flavour: "Learn what to do, then learn to do it without thought.",
  inkwell: true,
  colors: ["steel"],
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  illustrator: "Cristian Romero",
  number: 187,
  set: "ROF",
  rarity: "uncommon",
};
