import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { thisIsMyFamilyAbility } from "../../abilities";

export const thisIsMyFamily: LorcanitoActionCard = {
  id: "nk5",
  name: "This Is My Family",
  characteristics: ["action", "song"],
  text: "Gain 1 lore. Draw a card.",
  type: "action",
  abilities: [thisIsMyFamilyAbility],
  inkwell: false,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Cristian Romero",
  number: 81,
  set: "007",
  rarity: "common",
};
