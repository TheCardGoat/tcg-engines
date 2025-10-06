import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const princeCharmingHeirToTheThrone: LorcanaCharacterCardDefinition = {
  id: "nwc",
  name: "Prince Charming",
  title: "Heir to the Throne",
  characteristics: ["hero", "dreamborn", "prince"],
  type: "character",
  flavour:
    "He'd searched across the Inklands for the young woman who'd stolen his heart at the ball, only to find more mysteries.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 3,
  illustrator: "Vicky Xie / Mariana Moreno",
  number: 157,
  set: "ROF",
  rarity: "rare",
};
