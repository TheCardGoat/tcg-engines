import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const dalmatianPuppyTailWagger: LorcanaCharacterCardDefinition = {
  id: "n4q",
  reprints: ["xvo"],
  name: "Dalmatian Puppy",
  title: "Tail Wagger",
  characteristics: ["storyborn", "puppy"],
  text: "WHERE DID THEY ALL COME FROM? You may have up to 99 copies of Dalmatian Puppy - Tail Wagger in your deck.",
  type: "character",
  abilities: [],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 2,
  willpower: 3,
  illustrator: "Gwaii",
  number: 38,
  set: "008",
  rarity: "common",
  lore: 1,
  cardCopyLimit: 99,
};
