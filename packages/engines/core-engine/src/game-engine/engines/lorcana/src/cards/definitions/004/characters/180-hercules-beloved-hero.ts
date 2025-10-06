import {
  bodyguardAbility,
  resistAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const herculesBelovedHero: LorcanitoCharacterCardDefinition = {
  id: "o9h",
  reprints: ["p5o"],
  name: "Hercules",
  title: "Beloved Hero",
  characteristics: ["hero", "storyborn", "prince"],
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_\n\n\n**Resist +1** _(Damage dealt to this character is reduced by 1.)_",
  type: "character",
  abilities: [bodyguardAbility, resistAbility(1)],
  inkwell: true,
  colors: ["steel"],
  cost: 6,
  strength: 6,
  willpower: 5,
  lore: 2,
  illustrator: "Leonardo Giammichele",
  number: 180,
  set: "URR",
  rarity: "rare",
};
