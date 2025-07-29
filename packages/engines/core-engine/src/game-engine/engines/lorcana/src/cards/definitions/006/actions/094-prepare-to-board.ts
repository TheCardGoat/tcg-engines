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

export const prepareToBoard: LorcanitoActionCard = {
  id: "xwq",
  name: "Prepare To Board!",
  characteristics: ["action"],
  text: "Chosen character gets +2 {S} this turn. If a Pirate character is chosen, they get +3 {S} instead.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "target-conditional",
          autoResolve: false,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "characteristics", value: ["pirate"] },
            ],
          },
          effects: [
            {
              type: "attribute",
              attribute: "strength",
              amount: 3,
              modifier: "add",
              duration: "turn",
              target: {
                type: "card",
                value: 1,
                filters: [
                  { filter: "type", value: "character" },
                  { filter: "zone", value: "play" },
                  { filter: "characteristics", value: ["pirate"] },
                ],
              },
            },
          ],
          fallback: [
            {
              type: "attribute",
              attribute: "strength",
              amount: 2,
              modifier: "add",
              duration: "turn",
              target: {
                type: "card",
                value: 1,
                filters: [
                  { filter: "type", value: "character" },
                  { filter: "zone", value: "play" },
                ],
              },
            },
          ],
        } as TargetConditionalEffect,
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  illustrator: "Toni Bruno",
  number: 94,
  set: "006",
  rarity: "common",
};
