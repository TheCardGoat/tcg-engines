import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cardSoldiersFullDeck: LorcanaCharacterCardDefinition = {
  id: "x9a",
  reprints: ["yi4"],
  name: "Card Soldiers",
  title: "Full Deck",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour: "You'll have to deal with them sooner or later.",
  inkwell: true,
  colors: ["ruby"],
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  illustrator: "Bill Robinson",
  number: 105,
  set: "ROF",
  rarity: "uncommon",
};
