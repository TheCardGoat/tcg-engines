import {
  bodyguardAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const thunderboltWonderDog: LorcanaCharacterCardDefinition = {
  id: "e5x",
  name: "Thunderbolt",
  title: "Wonder Dog",
  characteristics: ["floodborn", "hero"],
  text: "Puppy Shift 3 (You may pay 3 {I} to play this on top of one of your Puppy characters.)\nBodyguard ",
  type: "character",
  abilities: [shiftAbility(3, "puppy"), bodyguardAbility],
  inkwell: true,
  // @ts-expect-error
  color: "",
  colors: ["amber", "sapphire"],
  cost: 5,
  strength: 3,
  willpower: 7,
  illustrator: "Max Grecke",
  number: 23,
  set: "007",
  rarity: "uncommon",
  lore: 2,
};
