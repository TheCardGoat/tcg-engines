import { chosenCharacterOfYoursAtLocation } from "@lorcanito/lorcana-engine/abilities/targets";
import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rayaGuardianOfTheDragonGem: LorcanitoCharacterCardDefinition = {
  id: "cbs",
  missingTestCase: true,
  name: "Raya",
  title: "Guardian of the Dragon Gem",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**WE MUST JOIN FORCES** When you play this character, ready chosen character of yours at a location. They can't quest for the rest of this turn.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "We Must Join Forces",
      text: "When you play this character, ready chosen character of yours at a location. They can't quest for the rest of this turn.",
      effects: readyAndCantQuest(chosenCharacterOfYoursAtLocation),
    },
  ],
  flavour: "There are too many for me. But not for us.",
  inkwell: true,
  colors: ["ruby"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Britteny Hackett",
  number: 122,
  set: "URR",
  rarity: "common",
};
