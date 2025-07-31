import { chosenCharacterGetsStrength } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const trialsAndTribulations: LorcanaActionCardDefinition = {
  id: "rky",
  missingTestCase: true,
  name: "Trials And Tribulations",
  characteristics: ["action", "song"],
  text: "Chosen character gets -4 {S} until the start of your next turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [chosenCharacterGetsStrength(-4, "next_turn")],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "Pauline Voss",
  number: 43,
  set: "008",
  rarity: "uncommon",
};
