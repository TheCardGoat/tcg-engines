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

export const dontLetTheFrostbiteBite: LorcanaActionCardDefinition = {
  id: "rdl",
  missingTestCase: true,
  name: "Don't Let the Frostbite Bite",
  characteristics: ["action", "song"],
  text: "_(A character with cost 7 or more can \n {E} to sing this song for free.)_<br>Ready all your characters. They can’t quest for the rest of this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Ready all your characters. They can’t quest for the rest of this turn.",
      effects: readyAndCantQuest(allYourCharacters),
    },
  ],
  flavour: "Let’s call it a night",
  inkwell: true,
  colors: ["ruby"],
  cost: 7,
  illustrator: "Linh Dang",
  number: 129,
  set: "SSK",
  rarity: "rare",
};
