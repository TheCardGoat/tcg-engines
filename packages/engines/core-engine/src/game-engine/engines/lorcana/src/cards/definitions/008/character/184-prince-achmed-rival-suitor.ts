import { exertChosenCharacterWithCharacteristics } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { whenYouPlayThisCharacter } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const princeAchmedRivalSuitor: LorcanaCharacterCardDefinition = {
  id: "ue3",
  name: "Prince Achmed",
  title: "Rival Suitor",
  characteristics: ["storyborn", "prince"],
  text: "UNWELCOME PROPOSAL When you play this character, you may exert chosen Princess character.",
  type: "character",
  abilities: [
    whenYouPlayThisCharacter({
      name: "UNWELCOME PROPOSAL",
      text: "When you play this character, you may exert chosen Princess character.",
      optional: true,
      effects: [exertChosenCharacterWithCharacteristics("princess")],
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  strength: 2,
  willpower: 2,
  illustrator: "Jake Murphy",
  number: 184,
  set: "008",
  rarity: "common",
  lore: 1,
};
