import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const captainHookForcefulDuelist: LorcanaCharacterCardDefinition = {
  id: "whb",
  reprints: ["uk5"],
  name: "Captain Hook",
  title: "Forceful Duelist",
  characteristics: ["dreamborn", "villain", "pirate", "captain"],
  text: "Challenger +2",
  type: "character",
  abilities: [challengerAbility(2)],
  inkwell: true,
  colors: ["steel"],
  cost: 1,
  strength: 1,
  willpower: 2,
  illustrator: "Ornella Savarese",
  number: 186,
  set: "008",
  rarity: "common",
  lore: 1,
};
