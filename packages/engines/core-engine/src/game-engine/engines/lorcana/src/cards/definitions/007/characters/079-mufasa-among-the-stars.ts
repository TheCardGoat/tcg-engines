import {
  evasiveAbility,
  resistAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mufasaAmongTheStars: LorcanaCharacterCardDefinition = {
  id: "p6w",
  name: "Mufasa",
  title: "Among the Stars",
  characteristics: ["floodborn", "mentor", "king"],
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Mufasa.)\nEvasive\nResist +1",
  type: "character",
  abilities: [shiftAbility(5, "Mufasa"), evasiveAbility, resistAbility(1)],
  inkwell: true,
  // @ts-expect-error
  color: "",
  colors: ["amethyst", "steel"],
  cost: 7,
  strength: 5,
  willpower: 7,
  illustrator: "Andrea Femerstrand",
  number: 79,
  set: "007",
  rarity: "uncommon",
  lore: 2,
};
