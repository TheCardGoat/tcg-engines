import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pongoOlRascal: LorcanaCharacterCardDefinition = {
  id: "apm",
  name: "Pongo",
  title: "Ol' Rascal",
  characteristics: ["hero", "storyborn"],
  text: "**Evasive** (_Only characters with Evasive can challenge this character._)",
  type: "character",
  abilities: [evasiveAbility],
  flavour:
    "At first I had no particular plan, just anything to attract attention. You know, stir things up a bit.",
  inkwell: true,
  colors: ["ruby"],
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  illustrator: "Brian Weisz",
  number: 120,
  set: "TFC",
  rarity: "common",
};
