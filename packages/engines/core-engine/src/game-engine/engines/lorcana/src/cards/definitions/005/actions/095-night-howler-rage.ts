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

export const nightHowlerRage: LorcanaActionCardDefinition = {
  id: "g2v",
  name: "Night Howler Rage",
  characteristics: ["action"],
  text: "Draw a card. Chosen character gains **Reckless** during their next turn._(They can’t quest and must challenge if able.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Draw a card. Chosen character gains **Reckless** during their next turn._(They can’t quest and must challenge if able.)_",
      effects: [chosenCharacterGainsRecklessDuringNextTurn, drawACard],
    },
  ],
  flavour:
    '"I think someone is targeting predators on purpose and making them go savage!" \n−Judy Hopps',
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  illustrator: "Antoine Couttolenc",
  number: 95,
  set: "SSK",
  rarity: "common",
};
