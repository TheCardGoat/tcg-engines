import { thisCharacterGetsStrength } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theDodoOutlandishStoryteller: LorcanaCharacterCardDefinition = {
  id: "l04",
  name: "The Dodo",
  title: "Outlandish Storyteller",
  characteristics: ["storyborn"],
  text: "AN EXTREMELY FATAL SITUATION This character receives +1 {S} for each damage on it.",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "effects",
      effects: [
        thisCharacterGetsStrength({
          dynamic: true,
          sourceAttribute: "damage",
        } as any), // Legacy: dynamic object
      ],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 0,
  willpower: 6,
  illustrator: "Filipe Lourenço",
  number: 126,
  set: "008",
  rarity: "common",
  lore: 1,
};
