import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { chosenOpposingCharacterLoseStrengthUntilNextTurn } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rhinoOnesixteenthWolf: LorcanaCharacterCardDefinition = {
  id: "h4h",
  name: "Rhino",
  title: "One-Sixteenth Wolf",
  characteristics: ["dreamborn", "ally"],
  text: "TINY HOWL When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.",
  type: "character",
  abilities: [
    whenYouPlayThis({
      name: "TINY HOWL",
      text: "When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.",
      effects: [chosenOpposingCharacterLoseStrengthUntilNextTurn(1)],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  strength: 1,
  willpower: 2,
  illustrator: "Ellie Horie",
  number: 15,
  set: "008",
  rarity: "common",
  lore: 1,
};
