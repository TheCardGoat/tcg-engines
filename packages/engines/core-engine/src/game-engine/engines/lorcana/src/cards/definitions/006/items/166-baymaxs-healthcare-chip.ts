import { tenThousandMedicalProcedures } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const baymaxsHealthcareChip: LorcanaItemCardDefinition = {
  id: "ele",
  missingTestCase: true,
  name: "Baymax's Healthcare Chip",
  characteristics: ["item"],
  text: "10,000 MEDICAL PROCEDURES {E} - Choose one:\n* Remove up to 1 damage from chosen character. \n* If you have a Robot character in play, remove up to 3 damage from chosen character.",
  type: "item",
  abilities: [tenThousandMedicalProcedures],
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Rudy Hill",
  number: 166,
  set: "006",
  rarity: "uncommon",
};
