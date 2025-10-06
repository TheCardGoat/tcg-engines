import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyBraveLittleTailor: LorcanitoCharacterCardDefinition = {
  id: "ygl",
  name: "Mickey Mouse",
  title: "Brave Little Tailor",
  characteristics: ["hero", "dreamborn"],
  text: "**Evasive** (_Only characters with Evasive can challenge this character._)",
  type: "character",
  abilities: [evasiveAbility],
  flavour:
    "When defeat looms and victory hangs by a thread, a hero bolts to the rescue, patching things up through shear determination.",
  inkwell: true,
  colors: ["ruby"],
  cost: 8,
  strength: 5,
  willpower: 5,
  lore: 4,
  illustrator: "Nicholas Kole",
  number: 115,
  set: "TFC",
  rarity: "legendary",
};
