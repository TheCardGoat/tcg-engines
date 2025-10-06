import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const bounPrecociousEnterpreneur: LorcanaCharacterCardDefinition = {
  id: "hz1",
  name: "Boun",
  title: "Precocious Entrepreneur",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour: "If you see any hungry faces, send 'em my way.",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Alice Pisoni",
  number: 104,
  set: "ROF",
  rarity: "common",
};
