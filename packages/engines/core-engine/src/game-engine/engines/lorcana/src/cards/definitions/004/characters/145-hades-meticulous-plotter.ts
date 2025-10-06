import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hadesMeticulousPlotter: LorcanaCharacterCardDefinition = {
  id: "d5u",
  name: "Hades",
  title: "Meticulous Plotter",
  characteristics: ["villain", "deity"],
  type: "character",
  flavour:
    "On this cute little plot Ursula tentacles are sold a mile away. That sneaky sea witch… Wait! I can use this thing. While you keep those hateful Illumineers busy, I can carry out my plan.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 3,
  willpower: 6,
  lore: 1,
  illustrator: "Carlos Ruiz",
  number: 145,
  set: "URR",
  rarity: "uncommon",
};
