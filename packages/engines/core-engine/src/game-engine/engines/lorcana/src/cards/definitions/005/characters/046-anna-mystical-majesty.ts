import { exertAllOpposingCharacters } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const annaMysticalMajesty: LorcanaCharacterCardDefinition = {
  id: "e80",
  name: "Anna",
  title: "Mystical Majesty",
  characteristics: ["hero", "floodborn", "queen", "sorcerer"],
  text: "**Shift** 4 _You may pay 4 {I} to play this on top of one of your characters named Anna.)_\n  \n**EXCEPTIONAL POWER** When you play this character, exert all opposing characters.",
  type: "character",
  abilities: [
    shiftAbility(4, "Anna"),
    {
      type: "resolution",
      name: "EXCEPTIONAL POWER",
      text: "When you play this character, exert all opposing characters.",
      effects: [exertAllOpposingCharacters],
    },
  ],
  colors: ["amethyst"],
  cost: 7,
  strength: 4,
  willpower: 5,
  lore: 2,
  illustrator: "Jackie Droujko",
  number: 46,
  set: "SSK",
  rarity: "rare",
};
