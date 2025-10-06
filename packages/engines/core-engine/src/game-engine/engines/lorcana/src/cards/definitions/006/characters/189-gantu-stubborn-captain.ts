// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const gantuStubbornCaptain: LorcanaCharacterCardDefinition = {
  id: "bny",
  name: "Gantu",
  title: "Captain Crankyhead",
  characteristics: ["dreamborn", "alien", "captain"],
  type: "character",
  inkwell: true,
  colors: ["steel"],
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 4,
  illustrator: "Luis Huerta",
  number: 189,
  set: "006",
  rarity: "rare",
};
