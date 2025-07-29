import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { restoringTheHeartAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";

export const restoringTheHeart: LorcanitoActionCard = {
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
