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

export const prepareYourBot: LorcanaActionCardDefinition = {
  id: "ht1",
  missingTestCase: true,
  name: "Prepare Your Bot",
  characteristics: ["action"],
  text: "Choose one:\n* Ready chosen item.\n* Ready chosen Robot character. They can't quest for the rest of this turn.",
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
              text: "Ready chosen item.",
              effects: [readyChosenItem],
            },
            {
              id: "2",
              text: "Ready chosen Robot character. They can't quest for the rest of this turn.",
              effects: readyAndCantQuest({
                type: "card",
                value: 1,
                filters: [
                  { filter: "type", value: "character" },
                  { filter: "zone", value: "play" },
                  { filter: "characteristics", value: ["robot"] },
                ],
              }),
            },
          ],
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Ian MacDonald",
  number: 165,
  set: "006",
  rarity: "uncommon",
};
