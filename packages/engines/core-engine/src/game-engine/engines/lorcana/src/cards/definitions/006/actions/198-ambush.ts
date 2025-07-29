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

export const ambush: LorcanitoActionCard = {
  id: "s1l",
  name: "Ambush!",
  characteristics: ["action"],
  text: "{E} one of your characters to deal damage equal to their {S} to chosen character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "exert",
          exert: true,
          target: chosenCharacter,
          afterEffect: [
            {
              type: "create-layer-based-on-target",
              // TODO: get rid of target
              target: thisCharacter,
              resolveAmountBeforeCreatingLayer: true,
              effects: [
                dealDamageEffect(
                  {
                    dynamic: true,
                    target: {
                      attribute: "strength",
                    },
                  },
                  chosenCharacterOrLocation,
                ),
              ],
            },
          ],
        },
      ],
    },
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 3,
  illustrator: "Ilaria Sposetti",
  number: 198,
  set: "006",
  rarity: "rare",
};
