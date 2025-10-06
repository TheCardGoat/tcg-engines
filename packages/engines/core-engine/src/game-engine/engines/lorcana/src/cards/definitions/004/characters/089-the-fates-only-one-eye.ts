import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theFatesOnlyOneEye: LorcanitoCharacterCardDefinition = {
  id: "k7n",
  missingTestCase: true,
  name: "The Fates",
  title: "Only One Eye",
  characteristics: ["storyborn", "ally"],
  text: "**ALL WILL BE SEEN** When you play this character, look at the top card of each opponent's deck.",
  type: "character",
  abilities: [],
  flavour: "We know everything.",
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  illustrator: "Jon Densk / Hayley Evans",
  number: 89,
  set: "URR",
  rarity: "common",
};
