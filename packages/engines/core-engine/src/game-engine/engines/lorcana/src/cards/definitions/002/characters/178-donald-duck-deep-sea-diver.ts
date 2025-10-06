import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const donaldDuckDeepSeaDiver: LorcanaCharacterCardDefinition = {
  id: "hoc",

  name: "Donald Duck",
  title: "Deep-Sea Diver",
  characteristics: ["hero", "dreamborn"],
  type: "character",
  flavour:
    "You go ahead, Minnie! I'm going to see if there's any lore over here.",
  inkwell: true,
  colors: ["steel"],
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 1,
  illustrator: "Nicholas Kole",
  number: 178,
  set: "ROF",
  rarity: "common",
};
