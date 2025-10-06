import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const queenOfHeartsImpulsiveRuler: LorcanitoCharacterCardDefinition = {
  id: "e84",
  reprints: ["tge"],
  name: "Queen of Hearts",
  title: "Impulsive Ruler",
  characteristics: ["queen", "storyborn", "villain"],
  text: "**Rush** _(This character can challenge the turn they're played.)_",
  type: "character",
  abilities: [rushAbility],
  flavour:
    'The glow of lore in the flood cought her eye. "The spellbook!" she cried. "Don\'t let it get away!"',
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Valerio Buonfantino",
  number: 119,
  set: "ROF",
  rarity: "uncommon",
};
