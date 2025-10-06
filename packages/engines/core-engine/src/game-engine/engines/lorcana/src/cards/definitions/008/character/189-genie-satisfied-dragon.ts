import {
  duringYourTurnThisCharacterGains,
  evasiveAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const genieSatisfiedDragon: LorcanaCharacterCardDefinition = {
  id: "sub",
  name: "Genie",
  title: "Satisfied Dragon",
  characteristics: ["storyborn", "ally", "dragon"],
  text: "BUG CATCHER During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  type: "character",
  abilities: [
    duringYourTurnThisCharacterGains({
      name: "BUG CATCHER",
      text: "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
      ability: evasiveAbility,
      conditions: [],
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 3,
  willpower: 4,
  illustrator: "Rosa la Barbera / Livio Cacciatore",
  number: 189,
  set: "008",
  rarity: "common",
  lore: 1,
};
