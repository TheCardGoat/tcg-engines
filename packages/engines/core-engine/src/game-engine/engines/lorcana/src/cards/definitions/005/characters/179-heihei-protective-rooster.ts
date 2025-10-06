import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const heiheiProtectiveRooster: LorcanaCharacterCardDefinition = {
  id: "l2b",
  name: "HeiHei",
  title: "Protective Rooster",
  characteristics: ["dreamborn", "ally"],
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your character must chose one with Bodyguard if able.)_",
  type: "character",
  abilities: [bodyguardAbility],
  flavour: 'Who’s the "boat snack" now?!',
  inkwell: true,
  colors: ["steel"],
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  illustrator: "Brian Weisz",
  number: 179,
  set: "SSK",
  rarity: "common",
};
