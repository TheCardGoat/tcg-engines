// TODO: Once the set is released, we organize the cards by set and type

import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { banishChosenItemOrLocation } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const billyBonesSpaceSailor: LorcanaCharacterCardDefinition = {
  id: "vn5",
  missingTestCase: true,
  name: "Billy Bones",
  title: "Space Sailor",
  characteristics: ["storyborn", "alien", "pirate"],
  text: "KEEP IT HIDDEN When this character is banished, you may banish chosen item or location.",
  type: "character",
  abilities: [
    whenThisCharacterBanished({
      name: "Keep It Hidden",
      text: "When this character is banished, you may banish chosen item or location.",
      optional: true,
      effects: [banishChosenItemOrLocation],
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  illustrator: "Diego Saito",
  number: 185,
  set: "006",
  rarity: "uncommon",
};
