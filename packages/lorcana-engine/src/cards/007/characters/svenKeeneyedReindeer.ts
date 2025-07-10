import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { chosenCharacterGetsStrength } from "@lorcanito/lorcana-engine/effects/effects";

export const svenKeeneyedReindeer: LorcanitoCharacterCard = {
  id: "x18",
  name: "Sven",
  title: "Keen-Eyed Reindeer",
  characteristics: ["storyborn", "ally"],
  type: "character",
  inkwell: true,
  // @ts-expect-error
  color: "",
  colors: ["amethyst", "sapphire"],
  cost: 5,
  strength: 2,
  willpower: 6,
  illustrator: "Juan Diego Leon",
  number: 65,
  set: "007",
  rarity: "uncommon",
  lore: 1,
  text: "Rush\nFORMIDABLE GLARE When you play this character, chosen character gets -3 {S} this turn.",
  abilities: [
    rushAbility,
    whenYouPlayThisCharacter({
      name: "Formidable Glare",
      text: "chosen character gets -3 {S} this turn",
      effects: [chosenCharacterGetsStrength(-3)],
    }),
  ],
};
