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

export const goodJob: LorcanaActionCardDefinition = {
  id: "jmf",
  name: "Good Job!",
  characteristics: ["action"],
  text: "Chosen character gets +1 {L} this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Good Job!",
      text: "Chosen character gets +1 {L} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          amount: 1,
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  illustrator: "Carlos Gomes Cabral",
  number: 27,
  set: "006",
  rarity: "common",
};
