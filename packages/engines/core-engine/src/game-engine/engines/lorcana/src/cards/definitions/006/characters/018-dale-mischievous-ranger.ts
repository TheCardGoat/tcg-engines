// TODO: Once the set is released, we organize the cards by set and type

import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { millOwnXCards } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const daleMischievousRanger: LorcanaCharacterCardDefinition = {
  id: "a6c",
  name: "Dale",
  title: "Mischievous Ranger",
  characteristics: ["hero", "storyborn"],
  text: "**NUTS ABOUT PRANKS** When you play this character, you may put the top 3 cards of your deck into your discard to give chosen character -3 {S} until the start of your next turn.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      optional: true,
      name: "Nuts About Pranks",
      dependentEffects: true,
      resolveEffectsIndividually: true,
      text: "When you play this character, you may put the top 3 cards of your deck into your discard to give chosen character -3 {S} until the start of your next turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 3,
          modifier: "subtract",
          duration: "next_turn",
          until: true,
          target: chosenCharacter,
        },
        ...millOwnXCards(3),
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Rosa la Barbera / Livio Cacciatore",
  number: 18,
  set: "006",
  rarity: "uncommon",
};
