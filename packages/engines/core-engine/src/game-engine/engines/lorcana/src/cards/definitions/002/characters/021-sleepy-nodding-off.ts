import { entersPlayExerted } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sleepyNoddingOff: LorcanitoCharacterCardDefinition = {
  id: "w0u",
  name: "Sleepy",
  title: "Nodding Off",
  characteristics: ["storyborn", "ally", "seven dwarfs"],
  text: "**YAWN!** This character enters play exerted.",
  type: "character",
  abilities: [
    entersPlayExerted({
      name: "Yawn!",
    }),
  ],
  flavour: "He never gets tired of naps.",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 2,
  illustrator: "Kendall Hale",
  number: 21,
  set: "ROF",
  rarity: "common",
};
