import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const liShangImperialCaptain: LorcanaCharacterCardDefinition = {
  id: "z2e",
  reprints: ["swm"],
  name: "Li Shang",
  title: "Imperial Captain",
  characteristics: ["hero", "dreamborn", "captain"],
  type: "character",
  flavour:
    "Immovable as a mountain and fierce as a dragon-the Empire's finest warrior.",
  inkwell: true,
  colors: ["steel"],
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  illustrator: "Carlos Ruiz",
  number: 182,
  set: "URR",
  rarity: "uncommon",
};
