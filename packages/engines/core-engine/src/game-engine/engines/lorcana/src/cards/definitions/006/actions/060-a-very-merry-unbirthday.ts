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

export const aVeryMerryUnbirthday: LorcanaActionCardDefinition = {
  id: "pfv",
  missingTestCase: true,
  name: "A Very Merry Unbirthday",
  characteristics: ["action", "song"],
  text: "(A character with cost 1 or more can {E} to sing this song for free.)\nEach opponent puts the top 2 cards of their deck into their discard.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "A Very Merry Unbirthday",
      text: "Each opponent puts the top 2 cards of their deck into their discard.",
      effects: millOpponentXCards(2),
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  illustrator: "Geoffrey Bodeau",
  number: 60,
  set: "006",
  rarity: "common",
};
