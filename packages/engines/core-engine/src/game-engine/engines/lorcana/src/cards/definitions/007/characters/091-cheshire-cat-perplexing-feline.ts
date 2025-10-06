import { madGrinAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cheshireCatPerplexingFeline: LorcanaCharacterCardDefinition = {
  id: "kfp",
  name: "Cheshire Cat",
  title: "Perplexing Feline",
  characteristics: ["storyborn"],
  text: "MAD GRIN When you play this character, you may deal 2 damage to chosen damaged character.",
  type: "character",
  abilities: [madGrinAbility],
  inkwell: true,
  colors: ["emerald"],
  cost: 5,
  strength: 4,
  willpower: 3,
  illustrator: "Sandara Tang",
  number: 91,
  set: "007",
  rarity: "common",
  lore: 2,
};
