import { thisIsMyFamilyAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export type LorcanaActionCardDefinition = any;

export const thisIsMyFamily: LorcanaActionCardDefinition = {
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
