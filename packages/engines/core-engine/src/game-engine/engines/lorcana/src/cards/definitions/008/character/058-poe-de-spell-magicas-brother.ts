import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const poeDeSpellMagicasBrother: LorcanaCharacterCardDefinition = {
  id: "ecw",
  name: "Poe De Spell",
  title: "Magica's Brother",
  characteristics: ["storyborn", "ally", "sorcerer"],
  type: "character",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 3,
  willpower: 4,
  illustrator: "Kamil Murzyn",
  number: 58,
  set: "008",
  rarity: "common",
  lore: 1,
};
