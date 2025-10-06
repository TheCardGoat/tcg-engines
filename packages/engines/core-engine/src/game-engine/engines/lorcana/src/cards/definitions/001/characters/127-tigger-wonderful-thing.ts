import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tiggerWonderfulThing: LorcanaCharacterCardDefinition = {
  id: "a3y",

  name: "Tigger",
  title: "Wonderful Thing",
  characteristics: ["storyborn", "tigger"],
  text: "**Evasive** (_Only characters with Evasive can challenge this character._)",
  type: "character",
  rarity: "uncommon",
  abilities: [evasiveAbility],
  flavour: '"I\'m the bounciest bouncer that ever bounced!"',
  inkwell: true,
  colors: ["ruby"],
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 2,
  illustrator: "Kenneth Anderson",
  number: 127,
  set: "TFC",
};
