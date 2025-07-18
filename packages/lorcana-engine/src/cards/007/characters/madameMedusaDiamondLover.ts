import {
  anotherChosenCharacterOfYours,
  thisCharacter,
} from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { chosenPlayerMillXCards } from "@lorcanito/lorcana-engine/effects/effects";

const searchInTheSwampAbility = wheneverQuests({
  name: "SEARCH THE SWAMP",
  text: "Whenever this character quests, you may deal 2 damage to another chosen character of yours to put the top 3 cards of chosen player's deck into their discard.",
  optional: true,
  effects: [
    {
      type: "damage",
      amount: 2,
      target: anotherChosenCharacterOfYours,
      afterEffect: [
        {
          type: "create-layer-based-on-target",
          target: thisCharacter,
          effects: [
            chosenPlayerMillXCards({
              amount: 3,
              name: "Search the Swamp",
              text: "put the top 3 cards of chosen player's deck into their discard.",
            }),
          ],
        },
      ],
    },
  ],
});

export const madameMedusaDiamondLover: LorcanitoCharacterCard = {
  id: "ekw",
  name: "Madame Medusa",
  title: "Diamond Lover",
  characteristics: ["storyborn", "villain"],
  text: "SEARCH THE SWAMP Whenever this character quests, you may deal 2 damage to another chosen character of yours to put the top 3 cards of chosen player's deck into their discard.",
  type: "character",
  abilities: [searchInTheSwampAbility],
  inkwell: true,
  colors: ["amethyst", "ruby"],
  cost: 4,
  strength: 3,
  willpower: 4,
  illustrator: "Roger Perez",
  number: 53,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
