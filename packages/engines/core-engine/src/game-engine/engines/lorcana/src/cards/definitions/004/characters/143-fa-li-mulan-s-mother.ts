import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const faLiMulansMother: LorcanaCharacterCardDefinition = {
  id: "u1g",
  name: "Fa Li",
  title: "Mulan's Mother",
  characteristics: ["storyborn", "mentor"],
  type: "character",
  flavour: "When far from home, Mulan often thinks of her calming presence.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Sarah Schmidt",
  number: 143,
  set: "URR",
  rarity: "common",
};
