import {
  resistAbility,
  singerAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theTroubadourMusicalNarrator: LorcanaCharacterCardDefinition = {
  id: "jh3",
  name: "The Troubadour",
  title: "Musical Narrator",
  characteristics: ["storyborn", "ally"],
  text: "Resist +1\nSinger 4",
  type: "character",
  abilities: [resistAbility(1), singerAbility(4)],
  inkwell: true,
  // @ts-expect-error
  color: "",
  colors: ["amber", "steel"],
  cost: 2,
  strength: 1,
  willpower: 3,
  illustrator: "Carmine Pucci",
  number: 11,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
