import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const beastThickSkinned: LorcanitoCharacterCardDefinition = {
  id: "xyo",
  name: "Beast",
  title: "Thick-Skinned",
  characteristics: ["hero", "storyborn", "prince"],
  text: "**Resist** +1 _(Damage dealt to this character is reduced by 1 )_",
  type: "character",
  abilities: [resistAbility(1)],
  flavour: "He's even tougher than he looks.",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Simangaliso Sibaya",
  number: 176,
  set: "URR",
  rarity: "common",
};
