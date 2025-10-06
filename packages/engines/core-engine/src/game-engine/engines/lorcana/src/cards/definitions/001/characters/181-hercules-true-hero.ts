import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const herculesTrueHero: LorcanaCharacterCardDefinition = {
  id: "uyj",
  reprints: ["s5k"],

  name: "Hercules",
  title: "True Hero",
  characteristics: ["hero", "dreamborn", "prince"],
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
  type: "character",
  abilities: [bodyguardAbility],
  flavour: "„You gotta admit, that was pretty heroic.",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Marcel Berg",
  number: 181,
  set: "TFC",
  rarity: "common",
};
