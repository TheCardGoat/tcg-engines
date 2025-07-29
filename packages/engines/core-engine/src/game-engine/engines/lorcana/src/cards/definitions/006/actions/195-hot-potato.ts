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

export const hotPotato: LorcanaActionCardDefinition = {
  id: "uzc",
  missingTestCase: true,
  name: "Hot Potato",
  characteristics: ["action"],
  text: "Choose one:\n\n· Deal 2 damage to chosen character.\n\n· Banish chosen item.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "modal",
          // TODO: Get rid of target
          target: chosenCharacter,
          modes: [
            {
              id: "1",
              text: "Deal 2 damage to chosen character.",
              effects: [dealDamageEffect(2, chosenCharacter)],
            },
            {
              id: "2",
              text: "Banish chosen item.",
              effects: [banishChosenItem],
            },
          ],
        },
      ],
    },
  ],
  flavour: '"This is not going to end well." \n−Pleakley',
  inkwell: true,
  colors: ["steel"],
  cost: 3,

  illustrator: "Nicolas Ky",
  number: 195,
  set: "006",
  rarity: "uncommon",
};
