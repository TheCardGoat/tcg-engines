import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import {
  chosenCharacter,
  chosenCharacterOfYours,
  chosenCharacterOrLocation,
  chosenOpposingCharacter,
  self,
  sourceTarget,
  thisCharacter,
  yourCharacters,
} from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import {
  banishChosenItem,
  chosenCharacterGainsSupport,
  chosenOpposingCharacterCantQuestNextTurn,
  dealDamageEffect,
  discardACard,
  discardAllCardsInOpponentsHand,
  drawACard,
  drawXCards,
  exertChosenCharacter,
  mayBanish,
  millOpponentXCards,
  moveDamageEffect,
  opponentLoseLore,
  putDamageEffect,
  readyAndCantQuest,
  readyChosenCharacter,
  readyChosenItem,
  returnChosenCharacterWithCostLess,
  youGainLore,
  youMayPutAnAdditionalCardFromYourHandIntoYourInkwell,
} from "@lorcanito/lorcana-engine/effects/effects";
import type { TargetConditionalEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";

export const theIslandsIPulledFromTheSea: LorcanitoActionCard = {
  id: "bnu",
  missingTestCase: true,
  name: "The Islands I Pulled From The Sea",
  characteristics: ["action", "song"],
  text: "(A character with cost 3 or more can {E} to sing this song for free.)\nSearch your deck for a location card, reveal that card to all players, and put it into your hand. Then, shuffle your deck.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "shuffle-deck",
          target: self,
        },
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "deck" },
              { filter: "owner", value: "self" },
              { filter: "type", value: "location" },
            ],
          },
          forEach: [
            {
              type: "reveal",
              target: {
                type: "card",
                value: 1,
                filters: [
                  { filter: "owner", value: "self" },
                  { filter: "type", value: "location" },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
  inkwell: false,
  colors: ["ruby"],
  cost: 3,
  strength: 0,
  illustrator: "Wietse Treurniet",
  number: 130,
  set: "006",
  rarity: "uncommon",
};
