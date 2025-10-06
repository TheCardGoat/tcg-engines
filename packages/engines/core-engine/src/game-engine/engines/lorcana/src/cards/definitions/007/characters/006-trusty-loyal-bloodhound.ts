import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const trustyLoyalBloodhound: LorcanitoCharacterCardDefinition = {
  id: "kcq",
  name: "Trusty",
  title: "Loyal Bloodhound",
  characteristics: ["storyborn", "ally"],
  text: "Support",
  type: "character",
  abilities: [supportAbility],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 2,
  willpower: 2,
  illustrator: "Yu Nguyen",
  number: 6,
  set: "007",
  rarity: "common",
  lore: 1,
};
