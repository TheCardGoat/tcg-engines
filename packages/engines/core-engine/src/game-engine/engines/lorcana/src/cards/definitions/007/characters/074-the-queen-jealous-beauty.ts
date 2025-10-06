import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";
import { notAnOrdinaryAppleAbility } from "./notAnOrdinaryAppleAbility";

export const theQueenJealousBeauty: LorcanaCharacterCardDefinition = {
  id: "tn7",
  name: "The Queen",
  title: "Jealous Beauty",
  characteristics: ["storyborn", "villain", "queen", "mage"],
  text: "NOT AN ORDINARY APPLE {E} - Choose 3 cards in an opponent's discard and put them under their deck to gain 3 lore. If you moved at least 1 Princess this way, gain 4 lore instead.",
  type: "character",
  abilities: [notAnOrdinaryAppleAbility],
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 4,
  willpower: 3,
  illustrator: "Malia Ewart",
  number: 74,
  set: "007",
  rarity: "legendary",
  lore: 1,
};
