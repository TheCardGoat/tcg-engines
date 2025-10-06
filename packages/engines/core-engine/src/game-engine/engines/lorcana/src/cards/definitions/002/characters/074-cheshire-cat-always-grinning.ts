import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cheshireCatAlwaysGrinning: LorcanitoCharacterCardDefinition = {
  id: "ctv",

  name: "Cheshire Cat",
  title: "Always Grinning",
  characteristics: ["storyborn"],
  type: "character",
  flavour:
    'Alice felt quite confused. "But I don\'t see much ink here at all. How can the flood still be changing the Inklands?" \\n\\n"Things are always changing, you know," said the Cat. "It would be quite a change if they didn\'t."',
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  illustrator: "Alex Accorsi",
  number: 74,
  set: "ROF",
  rarity: "uncommon",
};
