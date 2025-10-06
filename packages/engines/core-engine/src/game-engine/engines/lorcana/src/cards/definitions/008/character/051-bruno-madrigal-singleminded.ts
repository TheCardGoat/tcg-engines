import { chosenOpposingCharacterCantReadyNextTurn } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { whenYouPlayThis } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const brunoMadrigalSingleminded: LorcanaCharacterCardDefinition = {
  id: "iku",
  name: "Bruno Madrigal",
  title: "Single-Minded",
  characteristics: ["storyborn", "ally", "madrigal"],
  text: "STANDING TALL When you play this character, chosen opposing character can't ready at the start of their next turn.",
  type: "character",
  abilities: [
    whenYouPlayThis({
      name: "STANDING TALL",
      text: "When you play this character, chosen opposing character can't ready at the start of their next turn.",
      optional: false,
      effects: [chosenOpposingCharacterCantReadyNextTurn],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 3,
  willpower: 4,
  illustrator: "Natalia Trykowska",
  number: 51,
  set: "008",
  rarity: "common",
  lore: 1,
};
