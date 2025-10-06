import {
  challengerAbility,
  evasiveAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const diabloSpitefulRaven: LorcanitoCharacterCardDefinition = {
  id: "lzu",
  name: "Diablo",
  title: "Spiteful Raven",
  characteristics: ["storyborn", "ally"],
  text: "Evasive\nChallenger +2",
  type: "character",
  inkwell: true,
  colors: ["amethyst", "emerald"],
  cost: 2,
  strength: 1,
  willpower: 2,
  illustrator: "Mike Packer",
  number: 66,
  set: "007",
  rarity: "uncommon",
  lore: 1,
  abilities: [evasiveAbility, challengerAbility(2)],
};
