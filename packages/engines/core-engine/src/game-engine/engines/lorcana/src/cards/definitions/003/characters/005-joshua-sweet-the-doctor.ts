import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const joshuaSweetTheDoctor: LorcanaCharacterCardDefinition = {
  id: "xtr",
  missingTestCase: true,
  name: "Joshua Sweet",
  title: "The Doctor",
  characteristics: ["storyborn", "ally"],
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
  type: "character",
  abilities: [bodyguardAbility],
  flavour:
    "Heading out to the Inklands? Come on back if youu need patching up.",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 2,
  illustrator: "Jeanne Plounevez",
  number: 5,
  set: "ITI",
  rarity: "common",
};
