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

export const heffalumpsAndWoozles: LorcanitoActionCard = {
  id: "kml",
  name: "Heffalumps And Woozles",
  characteristics: ["song", "action"],
  text: "(A character with cost 2 or more can {E} to sing this song for free.)\nChosen opposing character can't quest during their next turn. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Heffalumps And Woozles",
      text: "Chosen opposing character can't quest during their next turn. Draw a card.",
      resolveEffectsIndividually: true,
      effects: [drawACard, chosenOpposingCharacterCantQuestNextTurn],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Domenico Russo",
  number: 95,
  set: "006",
  rarity: "common",
};
