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

export const submitToMyWill: LorcanaActionCardDefinition = {
  id: "k46",
  missingTestCase: true,
  name: "Bend To My Will",
  characteristics: ["action"],
  text: "Each opponent discards all cards in their hand.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Submit to My Will",
      text: "Each opponent discards all cards in their hand.",
      effects: [discardAllCardsInOpponentsHand],
    },
  ],
  inkwell: false,
  colors: ["emerald"],
  cost: 7,
  illustrator: "Michela Cacciatore",
  number: 93,
  set: "006",
  rarity: "super_rare",
};
