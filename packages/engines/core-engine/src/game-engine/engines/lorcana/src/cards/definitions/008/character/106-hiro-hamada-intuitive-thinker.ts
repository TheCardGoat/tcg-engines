import { readyChosenCharacterWithCharacteristics } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hiroHamadaIntuitiveThinker: LorcanaCharacterCardDefinition = {
  id: "yji",
  name: "Hiro Hamada",
  title: "Intuitive Thinker",
  characteristics: ["storyborn", "hero", "inventor"],
  text: "LOOK FOR A NEW ANGLE {E} - Ready chosen Floodborn character.",
  type: "character",
  abilities: [
    {
      type: "activated",
      name: "LOOK FOR A NEW ANGLE",
      text: "{E} - Ready chosen Floodborn character.",
      costs: [{ type: "exert" }],
      effects: [readyChosenCharacterWithCharacteristics(["floodborn"])],
    },
  ],
  inkwell: true,
  colors: ["emerald", "sapphire"],
  cost: 2,
  strength: 1,
  willpower: 3,
  illustrator: "Kendall Hale",
  number: 106,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
