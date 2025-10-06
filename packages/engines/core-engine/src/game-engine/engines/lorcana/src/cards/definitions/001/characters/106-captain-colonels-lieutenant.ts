import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const captainColonelsLieutenant: LorcanitoCharacterCardDefinition = {
  id: "t2f",
  name: "Captain",
  title: "Colonel's Lieutenant",
  characteristics: ["storyborn", "captain", "ally"],
  type: "character",
  flavour: "Barking signal. It's an alert. Report to the Colonel at once!",
  inkwell: true,
  colors: ["ruby"],
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 1,
  illustrator: "Brian Weisz",
  number: 106,
  set: "TFC",
  rarity: "uncommon",
};
