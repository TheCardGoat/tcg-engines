import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const fixitFelixJrTrustyBuilder: LorcanaCharacterCardDefinition = {
  id: "r49",
  name: "Fix‐It Felix, Jr.",
  title: "Trusty Builder",
  characteristics: ["hero", "storyborn"],
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
  type: "character",
  abilities: [bodyguardAbility],
  flavour: "Golly, this place is going to take some real fixing!",
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  illustrator: "Hedwig Hageman-Sand",
  number: 10,
  set: "SSK",
  rarity: "common",
};
