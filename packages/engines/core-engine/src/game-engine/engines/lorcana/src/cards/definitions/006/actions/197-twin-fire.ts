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

export const twinFire: LorcanitoActionCard = {
  id: "c2j",
  name: "Twin Fire",
  characteristics: ["action"],
  text: "Deal 2 damage to chosen character. Then, you may choose and discard a card to deal 2 damage to another chosen character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Twin Fire",
      text: "Then, you may choose and discard a card to deal 2 damage to another chosen character",
      optional: true,
      resolveEffectsIndividually: true,
      effects: [discardACard, dealDamageEffect(2, chosenCharacter)],
    },
    {
      type: "resolution",
      name: "Twin Fire",
      text: "Deal 2 damage to chosen character.",
      effects: [dealDamageEffect(2, chosenCharacter)],
    },
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 2,
  strength: 0,
  illustrator: "Taraneth",
  number: 197,
  set: "006",
  rarity: "common",
};
