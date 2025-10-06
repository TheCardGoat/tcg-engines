import {
  evasiveAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import { ifThereIsACardUnder } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { whileConditionThisCharacterGets } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMouseBraveLittlePrince: LorcanaCharacterCardDefinition = {
  id: "hin",
  name: "Mickey Mouse",
  title: "Brave Little Prince",
  characteristics: ["floodborn", "hero", "prince"],
  text: "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Mickey Mouse.)\nEvasive (Only characters with Evasive can challenge this character.)\nCROWNING ACHIEVEMENT While this character has a card under him, he gets +3 {S}, +3 {W}, and +3 {L}.",
  type: "character",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 2,
  willpower: 2,
  illustrator: "Cristian Romero",
  number: 111,
  set: "009",
  rarity: "legendary",
  abilities: [
    shiftAbility(5, "Mickey Mouse"),
    evasiveAbility,
    whileConditionThisCharacterGets({
      name: "CROWNING ACHIEVEMENT",
      text: "While this character has a card under him, he gets +3 {S}, +3 {W}, and +3 {L}",
      conditions: [ifThereIsACardUnder],
      attribute: "strength",
      amount: 3,
    }),
    whileConditionThisCharacterGets({
      name: "CROWNING ACHIEVEMENT",
      text: "While this character has a card under him, he gets +3 {S}, +3 {W}, and +3 {L}",
      conditions: [ifThereIsACardUnder],
      attribute: "willpower",
      amount: 3,
    }),
    whileConditionThisCharacterGets({
      name: "CROWNING ACHIEVEMENT",
      text: "While this character has a card under him, he gets +3 {S}, +3 {W}, and +3 {L}",
      conditions: [ifThereIsACardUnder],
      attribute: "lore",
      amount: 3,
    }),
  ],
  lore: 1,
};
