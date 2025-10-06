import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const goofyDaredevil: LorcanitoCharacterCardDefinition = {
  id: "h4l",
  name: "Goofy",
  title: "Daredevil",
  characteristics: ["hero", "dreamborn"],
  illustrator: "Kenneth Anderson",
  text: "**Evasive** (_Only characters with Evasive can challenge this character._)",
  type: "character",
  abilities: [evasiveAbility],
  flavour: "Sometimes you gotta give it the ol’ jump and hyuck.",
  inkwell: true,
  rarity: "common",
  colors: ["ruby"],
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  number: 111,
  set: "TFC",
};
