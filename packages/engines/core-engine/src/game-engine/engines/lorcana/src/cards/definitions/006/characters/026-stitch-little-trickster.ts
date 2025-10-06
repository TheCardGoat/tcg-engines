// TODO: Once the set is released, we organize the cards by set and type

import { thisCharacterGetsStrength } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const stitchLittleTrickster: LorcanaCharacterCardDefinition = {
  id: "usr",
  name: "Stitch",
  title: "Little Trickster",
  characteristics: ["storyborn", "hero", "alien"],
  text: "NEED A HAND? 1 {I} - This character gets +1 {S} this turn.",
  type: "character",
  abilities: [
    {
      type: "activated",
      costs: [{ type: "ink", amount: 1 }],
      effects: [thisCharacterGetsStrength(1)],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "César Vergara",
  number: 26,
  set: "006",
  rarity: "common",
};
