import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { weveGotCompanyAbility } from "../../abilities";

export const weveGotCompany: LorcanitoActionCard = {
  id: "vhs",
  name: "We've Got Company!",
  characteristics: ["action"],
  text: "Ready all your characters. They gain Reckless this turn. (They can't quest and must challenge if able.)",
  type: "action",
  abilities: [weveGotCompanyAbility],
  inkwell: false,
  colors: ["ruby"],
  cost: 3,
  illustrator: "Isaiah Mesq",
  number: 147,
  set: "007",
  rarity: "rare",
};
