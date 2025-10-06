import {
  rushAbility,
  yourCharactersNamedGain,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const flotsamUrsulaSpy: LorcanitoCharacterCardDefinition = {
  id: "apr",

  name: "Flotsam",
  title: "Ursula's Spy",
  characteristics: ["storyborn", "ally"],
  text: "**Rush** _(This character can challenge the turn they're played.)_\nc",
  type: "character",
  abilities: [
    rushAbility,
    yourCharactersNamedGain({
      name: "Jetsam",
      ability: rushAbility,
    }),
  ],
  flavour: "We know someone who can help you . . . for a price.",
  colors: ["amethyst"],
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  illustrator: "Luis Huerta",
  number: 43,
  set: "TFC",
  rarity: "rare",
};
