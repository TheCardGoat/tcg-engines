import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const herculesHeroInTraining: LorcanitoCharacterCardDefinition = {
  id: "keh",

  name: "Hercules",
  title: "Hero in Training",
  characteristics: ["hero", "storyborn", "prince"],
  type: "character",
  flavour: "No need to call IX-I-I!",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Eva Widermann",
  number: 182,
  set: "ROF",
  rarity: "common",
};
