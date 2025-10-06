import { hiddenAwayAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const snowWhiteFairestInTheLand: LorcanaCharacterCardDefinition = {
  id: "ue8",
  name: "Snow White",
  title: "Fairest in the Land",
  characteristics: ["storyborn", "hero", "princess"],
  text: "HIDDEN AWAY This character can't be challenged.",
  type: "character",
  abilities: [hiddenAwayAbility],
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 2,
  willpower: 2,
  illustrator: "Mario Manzanares",
  number: 33,
  set: "007",
  rarity: "uncommon",
  lore: 2,
};
