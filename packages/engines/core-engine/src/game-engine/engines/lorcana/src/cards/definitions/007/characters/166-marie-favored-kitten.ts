import { chosenCharacterGetsStrength } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { wheneverThisCharacterQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const marieFavoredKitten: LorcanaCharacterCardDefinition = {
  id: "r8k",
  name: "Marie",
  title: "Favored Kitten",
  characteristics: ["storyborn", "ally"],
  type: "character",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 1,
  willpower: 2,
  illustrator: "Ellie Horie",
  number: 166,
  set: "007",
  rarity: "uncommon",
  lore: 2,
  text: "I'LL SHOW YOU Whenever this character quests, you may give chosen character -2 {S} this turn.",
  abilities: [
    wheneverThisCharacterQuests({
      name: "I'LL SHOW YOU",
      text: "Whenever this character quests, you may give chosen character -2 {S} this turn.",
      effects: [chosenCharacterGetsStrength(-2)],
    }),
  ],
};
