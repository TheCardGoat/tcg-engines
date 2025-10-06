import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rudyGrooveDisrupter: LorcanitoCharacterCardDefinition = {
  id: "jrg",
  name: "Rudy",
  title: "Groove Disrupter",
  characteristics: ["storyborn"],
  type: "character",
  flavour:
    "The Illuminary can’t handle this much groove! We have to keep the noise down or it’ll fall apart for sure!",
  inkwell: true,
  colors: ["steel"],
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Jon Densk / Hayley Evans",
  number: 174,
  set: "SSK",
  rarity: "common",
};
