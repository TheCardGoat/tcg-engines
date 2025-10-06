// TODO: Once the set is released, we organize the cards by set and type

import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mrArrowLegacysFirstMate: LorcanaCharacterCardDefinition = {
  id: "l9e",
  name: "Mr. Arrow",
  title: "Legacy's First Mate",
  characteristics: ["storyborn", "ally", "alien"],
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)",
  type: "character",
  abilities: [resistAbility(1)],
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  illustrator: "Michela Cacciatore / Giulia Priori",
  number: 182,
  set: "006",
  rarity: "common",
};
