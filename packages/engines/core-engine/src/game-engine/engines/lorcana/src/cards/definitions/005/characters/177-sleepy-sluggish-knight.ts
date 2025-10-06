import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sleepySluggishKnight: LorcanaCharacterCardDefinition = {
  id: "zvc",
  name: "Sleepy",
  title: "Sluggish Knight",
  characteristics: ["dreamborn", "ally", "knight", "seven dwarfs"],
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
  type: "character",
  abilities: [bodyguardAbility],
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  willpower: 4,
  strength: 0,
  lore: 1,
  illustrator: "Wouter Bruenel",
  number: 177,
  set: "SSK",
  rarity: "uncommon",
};
