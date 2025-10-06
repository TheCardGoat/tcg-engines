import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverOneOfYourCharChallengesAnotherChar } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const queenOfHeartsSensingWeakness: LorcanaCharacterCardDefinition = {
  id: "l3z",
  reprints: ["a6w"],

  name: "Queen of Hearts",
  title: "Sensing Weakness",
  characteristics: ["floodborn", "queen", "villain"],
  text: "**Shift** 2 _You may pay 2 {I} to play this on top of one of your characters named Queen of Hearts.)_\n\n**LET THE GAME BEGIN** Whenever one of your characters challenges another character, you may draw a card.",
  type: "character",
  abilities: [
    shiftAbility(2, "queen of hearts"),
    wheneverOneOfYourCharChallengesAnotherChar({
      name: "Let the Game Begin",
      text: "Whenever one of your characters challenges another character, you may draw a card.",
      optional: true,
      effects: [drawACard],
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 1,
  illustrator: "Isaiah Mesq",
  number: 120,
  set: "ROF",
  rarity: "uncommon",
};
