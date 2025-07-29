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

export const tryEverything: LorcanaActionCardDefinition = {
  id: "vjj",
  missingTestCase: true,
  name: "Try Everything",
  characteristics: ["action", "song"],
  text: "_(A character with cost 4 or more can {E} to sing this song for free.)_\n<br>Remove up to 3 damage from chosen character and ready them. They can’t quest or challenge for the rest of this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Remove up to 3 damage from chosen character and ready them. They can’t quest or challenge for the rest of this turn.",
      effects: [
        {
          type: "heal",
          amount: 3,
          target: chosenCharacter,
        },
        ...readyAndCantQuest(chosenCharacter),
      ],
    },
  ],
  flavour: "I want to try even though I could fail",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  illustrator: "Nicolas Ky",
  number: 25,
  set: "SSK",
  rarity: "uncommon",
};
