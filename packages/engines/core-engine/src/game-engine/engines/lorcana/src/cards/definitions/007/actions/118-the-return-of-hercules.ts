import { theReturnOfHerculesAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export type LorcanaActionCardDefinition = any;

export const theReturnOfHercules: LorcanaActionCardDefinition = {
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
