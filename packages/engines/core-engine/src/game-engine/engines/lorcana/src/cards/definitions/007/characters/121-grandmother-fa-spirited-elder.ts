import { chosenCharacterGetsStrength } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { wheneverThisCharacterQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const grandmotherFaSpiritedElder: LorcanaCharacterCardDefinition = {
  id: "urj",
  name: "Grandmother Fa",
  title: "Spirited Elder",
  characteristics: ["storyborn", "ally"],
  text: "I'VE GOT ALL THE LUCK WE'LL NEED Whenever this character quests, you may give chosen character of yours +2 {S} this turn.",
  type: "character",
  abilities: [
    wheneverThisCharacterQuests({
      name: "I'VE GOT ALL THE LUCK WE'LL NEED",
      text: "Whenever this character quests, you may give chosen character of yours +2 {S} this turn.",
      effects: [chosenCharacterGetsStrength(2)],
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 1,
  willpower: 1,
  illustrator: "Jovi Sales",
  number: 121,
  set: "007",
  rarity: "common",
  lore: 2,
};
