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

export const helpingHand: LorcanitoActionCard = {
  id: "vl0",
  name: "Helping Hand",
  characteristics: ["action"],
  text: "Chosen character gains Support this turn. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Helping Hand",
      text: "Chosen character gains Support this turn. Draw a card.",
      resolveEffectsIndividually: true,
      effects: [chosenCharacterGainsSupport("turn"), drawACard],
    },
  ],
  inkwell: false,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Therese Vildefall",
  number: 164,
  set: "006",
  rarity: "common",
};
