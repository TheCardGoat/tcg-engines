import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import {
  wheneverQuests,
  wheneverYouPlayACharacter,
} from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { thisCharacterGetsLore } from "@lorcanito/lorcana-engine/effects/effects";

export const minnieMouseStoryteller: LorcanitoCharacterCard = {
  id: "m22",
  name: "Minnie Mouse",
  title: "Storyteller",
  characteristics: ["storyborn", "hero"],
  text: "GATHER AROUND Whenever you play a character, this character gets +1 {L} this turn.\nJUST ONE MORE Whenever this character quests, chosen opposing character loses {S} equal to this character's {L} until the start of your next turn.",
  type: "character",
  abilities: [
    wheneverYouPlayACharacter({
      name: "GATHER AROUND",
      text: "Whenever you play a character, this character gets +1 {L} this turn.",
      effects: [thisCharacterGetsLore(1)],
    }),
    wheneverQuests({
      name: "JUST ONE MORE",
      text: "Whenever this character quests, chosen opposing character loses {S} equal to this character's {L} until the start of your next turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: { dynamic: true, sourceAttribute: "lore" },
          modifier: "subtract",
          duration: "next_turn",
          resolveAmountBeforeCreatingLayer: true,
          until: true,
          target: chosenOpposingCharacter,
        },
      ],
    }),
  ],
  inkwell: false,
  colors: ["amber"],
  cost: 2,
  strength: 1,
  willpower: 2,
  illustrator: "SCG",
  number: 31,
  set: "007",
  rarity: "legendary",
  lore: 0,
};
