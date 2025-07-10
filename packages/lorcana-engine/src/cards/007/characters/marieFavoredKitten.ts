import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { chosenCharacterGetsStrength } from "@lorcanito/lorcana-engine/effects/effects";

export const marieFavoredKitten: LorcanitoCharacterCard = {
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
