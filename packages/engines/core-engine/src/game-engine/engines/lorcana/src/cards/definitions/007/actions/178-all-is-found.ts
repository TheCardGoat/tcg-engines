import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { allIsFoundAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";

export const allIsFound: LorcanitoActionCard = {
  id: "prl",
  name: "All Is Found",
  characteristics: ["song", "action"],
  text: "Put up to 2 cards from your discard into your inkwell, facedown and exerted.",
  type: "action",
  abilities: [allIsFoundAbility],
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  illustrator: "Kiyaa Jaspri",
  number: 178,
  set: "007",
  rarity: "rare",
};
