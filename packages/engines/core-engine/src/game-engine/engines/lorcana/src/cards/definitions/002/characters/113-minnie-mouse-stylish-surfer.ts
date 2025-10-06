import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const minnieMouseStylishSurfer: LorcanitoCharacterCardDefinition = {
  id: "t1b",

  name: "Minnie Mouse",
  title: "Stylish Surfer",
  characteristics: ["hero", "dreamborn"],
  text: "**Evasive** _Only characters with Evasive can challenge this character._",
  type: "character",
  abilities: [evasiveAbility],
  flavour: "This goes into my top ten most fun things!",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  illustrator: "Mario Oscar Gabriele",
  number: 113,
  set: "ROF",
  rarity: "uncommon",
};
