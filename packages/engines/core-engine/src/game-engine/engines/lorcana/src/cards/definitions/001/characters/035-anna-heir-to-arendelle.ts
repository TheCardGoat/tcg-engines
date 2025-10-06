import { haveElsaInPlay } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const annaHeirToArendelle: LorcanitoCharacterCardDefinition = {
  id: "ibd",
  name: "Anna",
  title: "Heir to Arendelle",
  characteristics: ["hero", "queen", "storyborn"],
  text: "**LOVING HEART** When you play this character, if you have a character named Elsa in play, choose an opposing character. The chosen character doesn't ready at the start of their next turn.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      resolutionConditions: [haveElsaInPlay],
      name: "Loving Heart",
      text: "When you play this character, if you have a character named Elsa in play, choose an opposing character. The chosen character doesn't ready at the start of their next turn.",
      effects: [
        {
          type: "restriction",
          restriction: "ready-at-start-of-turn",
          duration: "next_turn",
          target: chosenOpposingCharacter,
        },
      ],
    }),
  ],
  flavour: "Two sisters, one mind.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  illustrator: "Valerio Buonfantino",
  number: 35,
  set: "TFC",
  rarity: "uncommon",
};
