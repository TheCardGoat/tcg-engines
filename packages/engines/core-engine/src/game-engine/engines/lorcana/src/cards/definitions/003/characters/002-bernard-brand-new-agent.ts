import { atTheEndOfYourTurn } from "~/game-engine/engines/lorcana/src/abilities/atTheAbilities";
import { ifThisCharacterIsExerted } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { readyAndCantQuest } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { chosenCharacterOfYours } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const bernardBrandNewAgent: LorcanaCharacterCardDefinition = {
  id: "bzq",
  missingTestCase: true,
  name: "Bernard",
  title: "Brand-New Agent",
  characteristics: ["hero", "storyborn"],
  text: "**I'LL CHECK IT OUT** At the end of your turn, if this character is exerted, you may ready another chosen character of yours.",
  type: "character",
  abilities: [
    atTheEndOfYourTurn({
      name: "I'll Check it Out",
      text: "At the end of your turn, if this character is exerted, you may ready another chosen character of yours.",
      conditions: [ifThisCharacterIsExerted],
      optional: true,
      effects: readyAndCantQuest(chosenCharacterOfYours),
    }),
  ],
  flavour: "You stay there. I'll look for scattered lore.",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 2,
  illustrator: "Jacob McAlister",
  number: 2,
  set: "ITI",
  rarity: "rare",
};
