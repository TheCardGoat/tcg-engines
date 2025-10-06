import {
  chosenCharacter,
  chosenOpposingCharacter,
} from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import {
  moveDamageAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const belleAccomplishedMystic: LorcanitoCharacterCardDefinition = {
  id: "j8p",
  reprints: ["cqp"],
  missingTestCase: true,
  name: "Belle",
  title: "Accomplished Mystic",
  characteristics: ["hero", "floodborn", "sorcerer", "princess"],
  text: "**Shift** 3\n\n\n**ENHANCED HEALING** When you play this character, move up to 3 damage counters from chosen character to chosen opposing character.",
  type: "character",
  abilities: [
    shiftAbility(3, "belle"),
    whenYouPlayThis({
      name: "ENHANCED HEALING",
      text: "When you play this character, move up to 3 damage counters from chosen character to chosen opposing character.",
      ...moveDamageAbility({
        amount: 3,
        from: chosenCharacter,
        to: chosenOpposingCharacter,
      }),
    }),
  ],
  flavour: "The mixed ink had changed more than just the rose.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  illustrator: "Malia Ewart",
  number: 36,
  set: "URR",
  rarity: "super_rare",
};
