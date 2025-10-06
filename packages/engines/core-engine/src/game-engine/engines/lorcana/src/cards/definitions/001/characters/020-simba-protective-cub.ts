import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const simbaProtectiveCub: LorcanitoCharacterCardDefinition = {
  id: "z0z",
  name: "Simba",
  title: "Protective Cub",
  characteristics: ["hero", "storyborn", "prince"],
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
  type: "character",
  abilities: [bodyguardAbility],
  flavour: "Courage comes in all sizes.",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Filipe Laurentino",
  number: 20,
  set: "TFC",
  rarity: "common",
};
