import { banishChosenCharacter } from "@lorcanito/lorcana-engine/effects/effects";
import { whenYouPlayThisCharAbility } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const maleficentMonstrousDragon: LorcanaCharacterCardDefinition = {
  id: "gs4",
  reprints: ["c6o"],

  name: "Maleficent",
  title: "Monstrous Dragon",
  characteristics: ["storyborn", "villain", "dragon"],
  text: "**Dragon Fire** When you play this character, you may banish chosen character.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "Dragon Fire",
      text: "When you play this character, you may banish chosen character.",
      optional: true,
      effects: [banishChosenCharacter],
    }),
  ],
  flavour:
    "The ninth Rule of Villainy: When all else fails, turn into a dragon.",
  inkwell: true,
  colors: ["ruby"],
  cost: 9,
  strength: 7,
  willpower: 5,
  lore: 2,
  illustrator: "Luis Huerta",
  number: 113,
  set: "TFC",
  rarity: "legendary",
};
