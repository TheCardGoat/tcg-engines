import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jasmineDisguised: LorcanaCharacterCardDefinition = {
  id: "k91",

  name: "Jasmine",
  title: "Disguised",
  characteristics: ["storyborn", "princess"],
  type: "character",
  flavour:
    "Try to understand. I've never done a thing on my own. I've never had any real friends. . . . I've never even been outside the palace walls.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "R. La Barbera / L. Giammichele",
  number: 148,
  set: "TFC",
  rarity: "common",
};
