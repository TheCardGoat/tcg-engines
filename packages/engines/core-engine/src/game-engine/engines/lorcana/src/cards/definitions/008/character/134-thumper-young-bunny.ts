import { getStrengthThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const thumperYoungBunny: LorcanaCharacterCardDefinition = {
  id: "w1z",
  name: "Thumper",
  title: "Young Bunny",
  characteristics: ["storyborn", "ally"],
  text: "YOU CAN DO IT! {E} – Chosen character gets +3 {S} this turn.",
  type: "character",
  abilities: [
    {
      type: "activated",
      name: "YOU CAN DO IT!",
      text: "{E} – Chosen character gets +3 {S} this turn.",
      costs: [{ type: "exert" }],
      effects: [getStrengthThisTurn(3, chosenCharacter)],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 0,
  willpower: 3,
  illustrator: "Oggy Christenson",
  number: 134,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
