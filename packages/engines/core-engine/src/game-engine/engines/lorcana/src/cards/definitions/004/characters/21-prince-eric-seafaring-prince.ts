import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const princeEricSeafaringPrince: LorcanitoCharacterCardDefinition = {
  id: "nko",
  name: "Prince Eric",
  title: "Seafaring Prince",
  characteristics: ["hero", "dreamborn", "prince"],
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your character must chose one with Bodyguard if able.)_",
  type: "character",
  abilities: [bodyguardAbility],
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Ling Dang",
  number: 21,
  set: "URR",
  rarity: "common",
};
