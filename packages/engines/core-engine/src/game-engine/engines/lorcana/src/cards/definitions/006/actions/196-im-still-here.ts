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
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const imStillHere: LorcanaActionCardDefinition = {
  id: "aht",
  missingTestCase: true,
  name: "I'm Still Here",
  characteristics: ["song", "action"],
  text: "(A character with cost 3 or more can {E} to sing this song for free.)\nChosen character gains Resist +2 until the start of your next turn. Draw a card. (Damage dealt to them is reduced by 2.)",
  type: "action",
  abilities: [
    {
      type: "resolution",
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "ability",
          ability: "resist",
          modifier: "add",
          amount: 2,
          until: true,
          duration: "next_turn",
          target: chosenCharacter,
        },
        drawACard,
      ],
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 0,
  illustrator: "Mike Packer",
  number: 196,
  set: "006",
  rarity: "uncommon",
};
