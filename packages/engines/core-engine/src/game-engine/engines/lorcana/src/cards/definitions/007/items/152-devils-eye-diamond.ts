import { devilsEyeDiamondAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const devilsEyeDiamond: LorcanaItemCardDefinition = {
  id: "b3x",
  name: "Devil's Eye Diamond",
  characteristics: ["item"],
  text: "THE PRICE OF POWER {E} - If one of your characters was damaged this turn, gain 1 lore.",
  type: "item",
  abilities: [devilsEyeDiamondAbility],
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  illustrator: "Juan Diego Leon",
  number: 152,
  set: "007",
  rarity: "rare",
};
