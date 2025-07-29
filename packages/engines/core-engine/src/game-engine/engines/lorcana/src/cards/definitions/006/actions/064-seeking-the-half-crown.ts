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

export const seekingTheHalfCrown: LorcanaActionCardDefinition = {
  id: "fdo",
  missingTestCase: true,
  name: "Seeking The Half Crown",
  characteristics: ["action"],
  text: "For each Sorcerer character you have in play, you pay 1 {I} less to play this action.\nDraw 2 cards.",
  type: "action",
  abilities: [
    whenYouPlayThisForEachYouPayLess({
      amount: {
        dynamic: true,
        filters: [
          { filter: "owner", value: "self" },
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "characteristics", value: ["sorcerer"] },
        ],
      },
    }),
    {
      type: "resolution",
      effects: [drawXCards(2)],
    },
  ],
  inkwell: false,
  colors: ["amethyst"],
  cost: 5,
  illustrator: "French Carlomagno",
  number: 64,
  set: "006",
  rarity: "rare",
};
