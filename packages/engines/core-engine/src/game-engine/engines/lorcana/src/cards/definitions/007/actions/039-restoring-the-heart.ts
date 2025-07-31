import { restoringTheHeartAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const restoringTheHeart: LorcanaActionCardDefinition = {
  id: "gk9",
  name: "Restoring The Heart",
  characteristics: ["action"],
  text: "Remove up to 3 damage from chosen character or location. Draw a card.",
  type: "action",
  abilities: [restoringTheHeartAbility],
  inkwell: true,
  colors: ["amber", "sapphire"],
  cost: 1,
  illustrator: "Nicola Saviori / Livio Cacciatore",
  number: 39,
  set: "007",
  rarity: "uncommon",
};
