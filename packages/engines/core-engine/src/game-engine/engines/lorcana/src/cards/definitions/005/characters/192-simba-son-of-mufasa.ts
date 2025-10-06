import { banishChosenItemOrLocation } from "@lorcanito/lorcana-engine/effects/effects";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const simbaSonOfMufasa: LorcanitoCharacterCardDefinition = {
  id: "me7",
  missingTestCase: true,
  name: "Simba",
  title: "Son of Mufasa",
  characteristics: ["hero", "floodborn", "king"],
  text: "**Shift** 4 _(You may pay 4 {I} to play this on top of one of your characters named Simba.)_ **FEARSOME ROAR** When you play this character, you may banish chosen item or location.",
  type: "character",
  abilities: [
    shiftAbility(4, "Simba"),
    {
      type: "resolution",
      name: "FEARSOME ROAR",
      text: "When you play this character, you may banish chosen item or location.",
      optional: true,
      effects: [banishChosenItemOrLocation],
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 1,
  illustrator: "Shannon Hallstein",
  number: 192,
  set: "SSK",
  rarity: "uncommon",
};
