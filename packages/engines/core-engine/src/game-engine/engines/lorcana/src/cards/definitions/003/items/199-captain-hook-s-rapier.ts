import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import {
  challengerAbility,
  yourCharactersNamedGain,
} from "~/game-engine/engines/lorcana/src/abilities";
import { wheneverOpposingCharIsBanishedInChallenge } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";

export const captainHooksRapier: LorcanaItemCardDefinition = {
  id: "wmj",
  missingTestCase: true,
  name: "Captain Hook's Rapier",
  characteristics: ["item"],
  text: "**GET THOSE SCURVY BRATS!** During your turn, whenever one of your characters banishes another character in a challenge, you may pay 1 {I} to draw a card.\n\n\n**LET'S HAVE AT IT!</** Your characters named Captain Hook gain **Challenger** +1. _(They get +1 {S} while challenging.)_",
  type: "item",
  abilities: [
    wheneverOpposingCharIsBanishedInChallenge({
      name: "Get Those Scurvy Brats!",
      text: "During your turn, whenever one of your characters banishes another character in a challenge, you may pay 1 {I} to draw a card.",
      optional: true,
      costs: [{ type: "ink", amount: 1 }],
      effects: [drawACard],
    }),
    yourCharactersNamedGain({
      name: "Captain Hook",
      ability: challengerAbility(1),
      excludeSelf: true,
    }),
  ],
  colors: ["steel"],
  cost: 3,
  illustrator: "Jeremy Adams",
  number: 199,
  set: "ITI",
  rarity: "uncommon",
};
