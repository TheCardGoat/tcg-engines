import {
  challengerAbility,
  evasiveAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const archimedesElectrifiedOwl: LorcanitoCharacterCardDefinition = {
  id: "p40",
  name: "Archimedes",
  title: "Electrified Owl",
  characteristics: ["floodborn", "ally"],
  text: "**Shift** 3 _You may pay 3 {I} to play this on top of one of your characters named Archimedes.)_\n \n**Evasive** _(Only characters with Evasive can challenge this character._\n \n**Challenger** +3 _(While challenging, this character gets +3 {S}.)_",
  type: "character",
  abilities: [
    shiftAbility(3, "Archimedes"),
    evasiveAbility,
    challengerAbility(3),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 5,
  strength: 1,
  willpower: 4,
  lore: 2,
  illustrator: "Michaela Martin",
  number: 47,
  set: "SSK",
  rarity: "uncommon",
};
