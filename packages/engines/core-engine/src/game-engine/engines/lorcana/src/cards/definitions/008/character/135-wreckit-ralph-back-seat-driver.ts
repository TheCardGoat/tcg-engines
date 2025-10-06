import { getStrengthThisTurn } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { whenYouPlayThis } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const wreckitRalphBackSeatDriver: LorcanaCharacterCardDefinition = {
  id: "nhw",
  name: "Wreck-it Ralph",
  title: "Back Seat Driver",
  characteristics: ["storyborn", "hero", "racer"],
  text: "CHARGED UP When you play this character, chosen Racer character gets +4 {S} this turn.",
  type: "character",
  abilities: [
    whenYouPlayThis({
      name: "CHARGED UP",
      text: "When you play this character, chosen Racer character gets +4 {S} this turn.",
      effects: [
        getStrengthThisTurn(4, {
          type: "card",
          count: 1,
          filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "characteristics", value: ["racer"] },
          ],
        }),
      ],
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 4,
  willpower: 2,
  illustrator: "Joseph Buening",
  number: 135,
  set: "008",
  rarity: "rare",
  lore: 1,
};
