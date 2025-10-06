import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jumbaJookibaCriticalScientist: LorcanaCharacterCardDefinition = {
  id: "oom",
  name: "Jumba Jookiba",
  title: "Critical Scientist",
  characteristics: ["storyborn", "alien", "inventor"],
  type: "character",
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 1,
  willpower: 6,
  illustrator: "Malia Ewart",
  number: 173,
  set: "008",
  rarity: "uncommon",
  lore: 2,
};
