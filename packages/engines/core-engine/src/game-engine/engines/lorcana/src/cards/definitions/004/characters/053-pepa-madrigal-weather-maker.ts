import { exertAndCantReady } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { chosenOpposingCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pepaMadrigalWeatherMaker: LorcanaCharacterCardDefinition = {
  id: "zc5",
  missingTestCase: true,
  name: "Pepa Madrigal",
  title: "Weather Maker",
  characteristics: ["storyborn", "ally", "madrigal"],
  text: "**IT LOOKS LIKE RAIN** When you play this character, you may exert chosen opposing character. That character can't ready at the start of their next turn unless you're at a location.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "It Looks Like Rain",
      text: "When you play this character, you may exert chosen opposing character. That character can't ready at the start of their next turn unless you're at a location.",
      optional: true,
      effects: exertAndCantReady(chosenOpposingCharacter),
    },
  ],
  colors: ["amethyst"],
  cost: 5,
  strength: 1,
  willpower: 5,
  lore: 1,
  illustrator: "Samantha Erdini",
  number: 53,
  set: "URR",
  rarity: "rare",
};
