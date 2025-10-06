import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMouseSteamBoatPilot: LorcanaCharacterCardDefinition = {
  id: "p7k",
  reprints: ["y3c"],

  name: "Mickey Mouse",
  title: "Steamboat Pilot",
  characteristics: ["hero", "storyborn", "captain"],
  type: "character",
  flavour:
    "On rivers throughout the Inklands, the little steamboat’s whistle answers the cheery tunes of its pilot.",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Juan Diego Leon",
  number: 89,
  set: "TFC",
  rarity: "common",
};
