import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const boltDependableFriend: LorcanaCharacterCardDefinition = {
  id: "wzy",
  name: "Bolt",
  title: "Dependable Friend",
  characteristics: ["storyborn", "hero"],
  text: "Support",
  type: "character",
  abilities: [supportAbility],
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 2,
  willpower: 4,
  illustrator: "Ellie Horie",
  number: 18,
  set: "007",
  rarity: "common",
  lore: 2,
};
