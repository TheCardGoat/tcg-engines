import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const arthurDeterminedSquire: LorcanaCharacterCardDefinition = {
  id: "cto",
  name: "Arthur",
  title: "Determined Squire",
  characteristics: ["storyborn", "hero"],
  text: "NO MORE BOOKS Skip your turn's Draw step.",
  type: "character",
  // Implemented in RootStore draw step.
  // abilities: [
  //   {
  //     type: "static",
  //     ability: "skip-draw-step",
  //     name: "NO MORE BOOKS",
  //     text: "Skip your turn's Draw step.",
  //   },
  // ],
  inkwell: true,
  colors: ["sapphire", "steel"],
  cost: 4,
  strength: 6,
  willpower: 6,
  illustrator: "Edu Francisco",
  number: 168,
  set: "008",
  rarity: "uncommon",
  lore: 3,
};
