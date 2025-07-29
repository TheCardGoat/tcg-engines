import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { restoringTheCrownAbilities } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";

export const restoringTheCrown: LorcanaActionCardDefinition = {
  id: "oyt",
  name: "Restoring The Crown",
  characteristics: ["action"],
  text: "Exert all opposing characters. Whenever one of your characters banishes another character in a challenge this turn, gain 2 lore.",
  type: "action",
  abilities: restoringTheCrownAbilities,
  inkwell: false,
  colors: ["amethyst", "steel"],
  cost: 6,
  illustrator: "Jochen van Gool",
  number: 83,
  set: "007",
  rarity: "rare",
};
