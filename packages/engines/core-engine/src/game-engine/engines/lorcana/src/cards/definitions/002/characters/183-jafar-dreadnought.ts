import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import {
  duringYourTurnWheneverBanishesCharacterInChallenge,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jafarDreadnought: LorcanitoCharacterCardDefinition = {
  id: "cgs",

  name: "Jafar",
  title: "Dreadnought",
  characteristics: ["floodborn", "sorcerer", "villain"],
  text: "**Shift** 2 (_You may pay 2 {I} to play this on top of one of your characters named Jafar._)\n\n**NOW WHERE WERE WE?** During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
  type: "character",
  abilities: [
    shiftAbility(2, "jafar"),
    duringYourTurnWheneverBanishesCharacterInChallenge({
      name: "Now Where Were We?",
      text: "During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
      optional: true,
      effects: [drawACard],
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Cam Kendell",
  number: 183,
  set: "ROF",
  rarity: "uncommon",
};
