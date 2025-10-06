import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const montereyJackDefiantProtector: LorcanaCharacterCardDefinition = {
  id: "qhq",
  name: "Monterey Jack",
  title: "Defiant Protector",
  characteristics: ["storyborn", "ally"],
  text: "Bodyguard",
  type: "character",
  abilities: [bodyguardAbility],
  inkwell: true,
  colors: ["steel"],
  cost: 5,
  strength: 4,
  willpower: 5,
  illustrator: "Ricardo Caria",
  number: 188,
  set: "008",
  rarity: "common",
  lore: 2,
};
