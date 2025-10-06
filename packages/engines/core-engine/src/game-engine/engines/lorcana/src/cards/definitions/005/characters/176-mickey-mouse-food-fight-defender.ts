import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMouseFoodFightDefender: LorcanaCharacterCardDefinition = {
  id: "xff",
  name: "Mickey Mouse",
  title: "Food Fight Defender",
  characteristics: ["hero", "storyborn"],
  text: "**Resist** +1 _(Damage dealt to this character is reduced by 1.)_",
  type: "character",
  abilities: [resistAbility(1)],
  flavour: "Underestimating him is a recipe for disaster.",
  inkwell: true,
  colors: ["steel"],
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  illustrator: "Mariana Moreno",
  number: 176,
  set: "SSK",
  rarity: "common",
};
