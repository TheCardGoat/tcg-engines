import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const NnPuppies: LorcanaActionCardDefinition = {
  id: "cba",
  notImplemented: true,
  name: "99 Puppies",
  characteristics: ["action"],
  text: "Whenever one of your characters quests this turn, gain 1 lore.",
  type: "action",
  abilities: [],
  flavour: "Two, four, six, and three is nine, plus two is 11 . . . \n−Roger",
  colors: ["amber"],
  cost: 5,
  illustrator: "Agnes Christianson",
  number: 24,
  set: "ITI",
  rarity: "uncommon",
};
