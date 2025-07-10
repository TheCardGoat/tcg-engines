import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { wakeUpAliceAbility } from "../../abilities";

export const wakeUpAlice: LorcanitoActionCard = {
  id: "a3c",
  name: "Wake Up, Alice!",
  characteristics: ["action"],
  text: "Return chosen damaged character to their player's hand.",
  type: "action",
  abilities: [wakeUpAliceAbility],
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  illustrator: "Valentina Graziano",
  number: 116,
  set: "007",
  rarity: "common",
};
