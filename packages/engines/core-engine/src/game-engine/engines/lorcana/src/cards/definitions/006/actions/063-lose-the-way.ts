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

export const loseTheWay: LorcanaActionCardDefinition = {
  id: "la7",
  name: "Lose The Way",
  characteristics: ["action"],
  text: "Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.",
  type: "action",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Douglas De La Hoz",
  number: 63,
  set: "006",
  rarity: "uncommon",
  abilities: [
    {
      type: "resolution",
      name: "Lose The Way",
      text: "Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.",
      effects: [
        {
          ...exertChosenCharacter,
          afterEffect: [
            {
              type: "create-layer-based-on-target",
              target: thisCharacter,
              replaceEffectTarget: true,
              resolveEffectsIndividually: true,
              optional: true,
              effects: [
                {
                  type: "restriction",
                  restriction: "ready-at-start-of-turn",
                  duration: "next_turn",
                  until: true,
                  target: sourceTarget,
                },
                discardACard,
              ],
            },
          ],
        },
      ],
    },
  ],
};
