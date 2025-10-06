import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const liShangGeneralsSon: LorcanaCharacterCardDefinition = {
  id: "e9z",
  name: "Li Shang",
  title: "General's Son",
  characteristics: ["hero", "storyborn"],
  type: "character",
  flavour:
    "His training was unsurpassed, but it was his courage that would see him through this fight.",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Brian Kesinger",
  number: 111,
  set: "URR",
  rarity: "common",
};
