import type {
  CardEffectTarget,
  LorcanitoActionCard,
  ResolutionAbility,
  TargetCardEffect,
} from "@lorcanito/lorcana-engine";
import { foodFightAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import {
  chosenCharacter,
  chosenCharacterItemOrLocation,
  opposingCharactersWithEvasive,
  opposingCharactersWithoutEvasive,
} from "@lorcanito/lorcana-engine/abilities/target";
import {
  allYourCharacters,
  anyCard,
  anyNumberOfChosenCharacters,
  chosenCharacterOfYours,
  self,
  targetCard,
  thisCard,
  thisCharacter,
  topCardOfYourDeck,
  yourCharacters,
} from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import {
  banishChosenCharacterOfYours,
  banishChosenOpposingCharacter,
  choseCharacterGainsReckless,
  chosenCharacterCantChallengeDuringNextTurn,
  chosenCharacterGainsEvasive,
  chosenCharacterGainsRecklessDuringNextTurn,
  chosenCharacterGainsResist,
  chosenCharacterGainsRush,
  chosenCharacterOfYoursGainsChallengerX,
  chosenCharacterOfYoursGainsWhenBanishedReturnToHand,
  dealDamageEffect,
  drawACard,
  drawCardsUntilYouHaveSameNumberOfCardsAsOpponent,
  drawXCards,
  putCardFromYourHandOnTheTopOfYourDeck,
  readyAndCantQuest,
  youGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";
import type {
  RevealTopCardEffect,
  ShuffleEffect,
} from "@lorcanito/lorcana-engine/effects/effectTypes";

export const everAsBefore: LorcanaActionCardDefinition = {
  id: "nlq",
  missingTestCase: true,
  name: "Ever as Before",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can {E} to sing this song for free.)_<br/>Remove up to 2 damage from any number of chosen characters.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "heal",
          amount: 2,
          target: anyNumberOfChosenCharacters,
        },
      ],
    },
  ],
  flavour: "Ever just as sure\nAs the sun will rise",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Grace Tran",
  number: 162,
  set: "SSK",
  rarity: "common",
};
