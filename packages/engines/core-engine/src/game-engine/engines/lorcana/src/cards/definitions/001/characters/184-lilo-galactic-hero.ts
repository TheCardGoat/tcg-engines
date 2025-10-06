import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const liloGalacticHero: LorcanaCharacterCardDefinition = {
  id: "x99",
  name: "Lilo",
  title: "Galactic Hero",
  characteristics: ["hero", "dreamborn"],
  type: "character",
  flavour: "Space. That's where aliens come from. And also tourists!",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 2,
  illustrator: "Jared Nickerl",
  number: 184,
  set: "TFC",
  rarity: "uncommon",
};
