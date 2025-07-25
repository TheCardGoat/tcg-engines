import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { theReturnOfHerculesAbility } from "../../abilities";

export const theReturnOfHercules: LorcanitoActionCard = {
  id: "zun",
  name: "The Return Of Hercules",
  characteristics: ["action"],
  text: "Each player may reveal a character card from their hand and play it for free.",
  type: "action",
  abilities: theReturnOfHerculesAbility,
  inkwell: true,
  colors: ["emerald"],
  cost: 5,
  illustrator: "Kevin Sidharta",
  number: 118,
  set: "007",
  rarity: "legendary",
};
