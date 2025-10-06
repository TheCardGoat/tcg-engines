import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jimDearBelovedHusband: LorcanaCharacterCardDefinition = {
  id: "qox",
  name: "Jim Dear",
  title: "Beloved Husband",
  characteristics: ["storyborn", "ally"],
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  type: "character",
  abilities: [bodyguardAbility],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 0,
  willpower: 4,
  illustrator: "Kendall Hale",
  number: 12,
  set: "008",
  rarity: "common",
  lore: 1,
};
