import { whileAnotherDamagedCharacterIsInPlay } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const nothingToIt = {
  ...evasiveAbility,
  name: "NOTHING TO IT",
  text: "While another character in play has damage, this character gains Evasive.",
  conditions: [whileAnotherDamagedCharacterIsInPlay],
};

export const billTheLizardChimneySweep: LorcanaCharacterCardDefinition = {
  id: "rga",
  name: "Bill The Lizard",
  title: "Chimney Sweep",
  characteristics: ["storyborn"],
  text: "NOTHING TO IT While another character in play has damage, this character gains Evasive.",
  type: "character",
  abilities: [nothingToIt],
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  strength: 1,
  willpower: 2,
  illustrator: "Kendall Hale",
  number: 90,
  set: "008",
  rarity: "common",
  lore: 1,
};
