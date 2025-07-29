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

export const energyBlast: LorcanaActionCardDefinition = {
  id: "e8s",
  name: "Energy Blast",
  characteristics: ["action"],
  text: "Banish chosen character. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      resolveEffectsIndividually: true,
      effects: [mayBanish(chosenCharacter), drawACard],
    },
  ],
  inkwell: false,
  colors: ["ruby"],
  cost: 7,
  strength: 0,
  illustrator: "Marco Giorgini",
  number: 131,
  set: "006",
  rarity: "rare",
};
