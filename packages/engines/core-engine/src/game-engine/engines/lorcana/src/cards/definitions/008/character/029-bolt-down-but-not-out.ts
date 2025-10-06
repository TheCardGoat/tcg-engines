import { entersPlayExerted } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const boltDownButNotOut: LorcanaCharacterCardDefinition = {
  id: "ase",
  name: "Bolt",
  title: "Down but Not Out",
  characteristics: ["storyborn", "hero"],
  text: "NONE OF YOUR POWERS ARE WORKING This character enters play exerted.",
  type: "character",
  inkwell: true,
  colors: ["amber", "steel"],
  cost: 3,
  strength: 0,
  willpower: 4,
  illustrator: "Joy Ang / Jaime Puga",
  number: 29,
  set: "008",
  rarity: "rare",
  lore: 4,
  abilities: [
    entersPlayExerted({
      name: "NONE OF YOUR POWERS ARE WORKING",
    }),
  ],
};
