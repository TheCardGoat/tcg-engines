import {
  whenYouPlayMayDrawACard,
  whenYouPlayThisCharAbility,
} from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const maleficentSorceress: LorcanitoCharacterCardDefinition = {
  id: "eb1",

  name: "Maleficent",
  title: "Sorceress",
  characteristics: ["sorcerer", "storyborn", "villain"],
  text: "**CAST MY SPELL** When you play this character, you may draw a card.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      ...whenYouPlayMayDrawACard,
      name: "Cast My Spell",
      text: "When you play this character, you may draw a card.",
    }),
  ],
  flavour:
    "You dare challenge me? Fool, my magic is more \rpowerful than you could possibly imagine!",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Valerio Buonfantino",
  number: 49,
  set: "TFC",
  rarity: "common",
};
