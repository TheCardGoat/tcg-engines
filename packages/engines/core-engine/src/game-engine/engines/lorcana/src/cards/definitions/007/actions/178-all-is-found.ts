import { allIsFoundAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export type LorcanaActionCardDefinition = any;

export const allIsFound: LorcanaActionCardDefinition = {
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
