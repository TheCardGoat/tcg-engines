import { chosenCharacterGainsRush } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mushuFasttalkingDragon: LorcanaCharacterCardDefinition = {
  id: "gii",
  name: "Mushu",
  title: "Fast-Talking Dragon",
  characteristics: ["storyborn", "ally", "dragon"],
  text: "LET'S GET THIS SHOW ON THE ROAD {E} – Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
  type: "character",
  abilities: [
    {
      type: "activated",
      name: "LET'S GET THIS SHOW ON THE ROAD",
      text: "{E} – Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
      costs: [{ type: "exert" }],
      effects: [chosenCharacterGainsRush],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 2,
  willpower: 3,
  illustrator: "Kuya Jaypi",
  number: 130,
  set: "008",
  rarity: "common",
  lore: 1,
};
