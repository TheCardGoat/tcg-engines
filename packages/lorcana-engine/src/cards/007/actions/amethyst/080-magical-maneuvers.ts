import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { magicalManeuversAbility } from "../../abilities";

export const magicalManeuvers: LorcanitoActionCard = {
  id: "y05",
  name: "Magical Maneuvers",
  characteristics: ["action"],
  text: "Return chosen character of yours to your hand. Exert chosen character.",
  type: "action",
  abilities: [magicalManeuversAbility],
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Jennifer Wu",
  number: 80,
  set: "007",
  rarity: "uncommon",
};
