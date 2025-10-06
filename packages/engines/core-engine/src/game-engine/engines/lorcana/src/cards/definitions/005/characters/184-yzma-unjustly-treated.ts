import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverOpposingCharIsBanishedInChallenge } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const yzmaUnjustlyTreated: LorcanaCharacterCardDefinition = {
  id: "pdd",
  missingTestCase: true,
  name: "Yzma",
  title: "Unjustly Treated",
  characteristics: ["dreamborn", "sorcerer", "villain"],
  text: "**I'M WARNING YOU!** During your turn, whenever one of your characters banishes a character in a challenge, you may deal 1 damage to chosen character.",
  type: "character",
  abilities: [
    wheneverOpposingCharIsBanishedInChallenge({
      name: "I'm Warning You!",
      text: "During your turn, whenever one of your characters banishes a character in a challenge, you may deal 1 damage to chosen character.",
      conditions: [duringYourTurn],
      optional: true,
      effects: [dealDamageEffect(1, chosenCharacter)],
    }),
  ],
  flavour:
    "What do you mean, 'not on the list'?! I told you to always put me on the list!",
  colors: ["steel"],
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  illustrator: "Carlos Gomes Cabral",
  number: 184,
  set: "SSK",
  rarity: "rare",
};
