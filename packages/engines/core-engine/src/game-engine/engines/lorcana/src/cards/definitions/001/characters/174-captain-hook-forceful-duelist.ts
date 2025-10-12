import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const captainHookForcefulDuelist: LorcanaCharacterCardDefinition = {
  id: "uk5",
  reprints: ["whb"],
  name: "Captain Hook",
  title: "Forceful Duelist",
  characteristics: ["dreamborn", "villain", "pirate", "captain"],
  text: "**Challenger** +2 (_While challenging, this character get +2 {S}._)",
  type: "character",
  abilities: [challengerAbility(2)],
  flavour: "He loves to make light of a foe's predicament.",
  inkwell: true,
  colors: ["steel"],
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  illustrator: "Marcel Berg",
  number: 174,
  set: "TFC",
  rarity: "common",
};
