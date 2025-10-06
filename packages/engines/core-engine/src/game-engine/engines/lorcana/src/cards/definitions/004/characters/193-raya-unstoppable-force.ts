import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import {
  challengerAbility,
  resistAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import { wheneverBanishesAnotherCharacterInChallenge } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rayaUnstoppableForce: LorcanaCharacterCardDefinition = {
  id: "db2",
  missingTestCase: true,
  name: "Raya",
  title: "Unstoppable Force",
  characteristics: ["hero", "dreamborn", "princess"],
  text: "**Challenger +2** _(While challenging, this character gets +2 {S}.)_\n\n\n**Resist +2** _(Damage dealt to this character is reduced by 2.)_\n\n\n**YOU GAVE IT YOUR BEST** During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
  type: "character",
  abilities: [
    challengerAbility(2),
    resistAbility(2),
    wheneverBanishesAnotherCharacterInChallenge({
      name: "YOU GAVE IT YOUR BEST",
      text: "During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
      optional: true,
      effects: [drawACard],
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 2,
  illustrator: "Grace Tran",
  number: 193,
  set: "URR",
  rarity: "super_rare",
};
