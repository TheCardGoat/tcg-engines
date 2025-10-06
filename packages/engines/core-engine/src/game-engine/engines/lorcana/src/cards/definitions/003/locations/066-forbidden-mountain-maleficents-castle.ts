import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const forbiddenMountainMaleficentsCastle: LorcanaLocationCardDefinition =
  {
    id: "k31",
    type: "location",
    name: "Forbidden Mountain",
    title: "Maleficent's Castle",
    characteristics: ["location"],
    inkwell: true,
    colors: ["amethyst"],
    cost: 2,
    willpower: 6,
    lore: 1,
    moveCost: 1,
    illustrator: "Jimmy Lo",
    number: 66,
    set: "ITI",
    rarity: "common",
  };
