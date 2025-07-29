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

export const unfortunateSituation: LorcanitoActionCard = {
  id: "wcu",
  missingTestCase: true,
  name: "Unfortunate Situation",
  characteristics: ["action"],
  text: "Each opponent chooses one of their characters and deals 4 damage to them.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      responder: "opponent",
      effects: [dealDamageEffect(4, chosenCharacterOfYours)],
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  illustrator: "Mariano Moreno",
  number: 199,
  set: "006",
  rarity: "uncommon",
};
