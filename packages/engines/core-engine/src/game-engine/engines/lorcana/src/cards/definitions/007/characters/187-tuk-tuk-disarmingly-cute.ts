import {
  bodyguardAbility,
  resistAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tukTukDisarminglyCute: LorcanaCharacterCardDefinition = {
  id: "v8s",
  name: "Tuk Tuk",
  title: "Disarmingly Cute",
  characteristics: ["storyborn", "ally"],
  text: "Bodyguard\nResist +2",
  type: "character",
  abilities: [bodyguardAbility, resistAbility(2)],
  inkwell: false,
  colors: ["steel"],
  cost: 2,
  strength: 0,
  willpower: 1,
  illustrator: "Maria Dresden",
  number: 187,
  set: "007",
  rarity: "rare",
  lore: 1,
};
