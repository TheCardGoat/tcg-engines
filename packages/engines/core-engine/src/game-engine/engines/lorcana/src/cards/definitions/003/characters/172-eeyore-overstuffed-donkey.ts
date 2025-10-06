import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const eeyoreOverstuffedDonkey: LorcanaCharacterCardDefinition = {
  id: "jrd",
  reprints: ["k3s"],
  name: "Eeyore",
  title: "Overstuffed Donkey",
  characteristics: ["storyborn", "ally"],
  text: "**Resist** +1 _(Damage dealt to this character is reduced by 1.)_",
  type: "character",
  abilities: [resistAbility(1)],
  flavour: "Not much of a roadblock, but I suppose I'll do.",
  inkwell: true,
  colors: ["steel"],
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  illustrator: "Mariana Moreno",
  number: 172,
  set: "ITI",
  rarity: "common",
};
