import {
  whileThisCharacterHasNoDamageGains,
  whileThisCharacterHasNoDamageGets,
} from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import { thisCharacterGetsStrength } from "@lorcanito/lorcana-engine/effects/effects";
import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const plutoAbilityNameAndText = {
  name: "HAPPY HELPER",
  text: "While this character has no damage, he gets +2 {S} and gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
};

export const plutoTriedAndTrue: LorcanaCharacterCardDefinition = {
  id: "fpu",
  name: "Pluto",
  title: "Tried and True",
  characteristics: ["storyborn", "ally"],
  text: "HAPPY HELPER While this character has no damage, he gets +2 {S} and gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  type: "character",
  abilities: [
    whileThisCharacterHasNoDamageGets({
      ...plutoAbilityNameAndText,
      effects: [thisCharacterGetsStrength(2)],
    }),
    whileThisCharacterHasNoDamageGains({
      ...plutoAbilityNameAndText,
      ability: supportAbility,
    }),
  ],
  inkwell: true,
  colors: ["amber", "steel"],
  cost: 6,
  strength: 2,
  willpower: 7,
  illustrator: "Raquel Villanueva",
  number: 28,
  set: "008",
  rarity: "uncommon",
  lore: 2,
};
