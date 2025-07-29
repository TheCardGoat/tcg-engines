import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { showMeMoreAbilities } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";

export const showMeMore: LorcanaActionCardDefinition = {
  id: "f8z",
  name: "Show Me More!",
  characteristics: ["action"],
  text: "Each player draws 3 cards.",
  type: "action",
  abilities: showMeMoreAbilities,
  inkwell: false,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Natalie Dombois",
  number: 82,
  set: "007",
  rarity: "super_rare",
};
