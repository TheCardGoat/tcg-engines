import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const seargentTibbies: LorcanitoCharacterCardDefinition = {
  id: "bpd",
  reprints: ["cz0"],

  name: "Sergeant Tibbs",
  title: "Courageous Cat",
  characteristics: ["storyborn"],
  type: "character",
  flavour: "Yes, sir. Righto, sir. Right away, sir...",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Cory Godbey",
  number: 124,
  set: "TFC",
  rarity: "common",
};
