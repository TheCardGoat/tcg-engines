// TODO: Once the set is released, we organize the cards by set and type

import { exertChosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { whenThisCharacterBanished } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theCarpenterDinnerCompanion: LorcanaCharacterCardDefinition = {
  id: "wn7",
  missingTestCase: true,
  name: "The Carpenter",
  title: "Dinner Companion",
  characteristics: ["storyborn"],
  text: "I'LL GET YOU! When this character is banished, you may exert chosen character.",
  type: "character",
  abilities: [
    whenThisCharacterBanished({
      name: "The Carpenter",
      text: "When this character is banished, you may exert chosen character.",
      optional: true,
      effects: [exertChosenCharacter],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  illustrator: "Andrea Parisi",
  number: 44,
  set: "006",
  rarity: "common",
};
