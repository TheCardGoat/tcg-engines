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

export const hypnoticDeduction: LorcanitoActionCard = {
  id: "z2p",
  name: "Hypnotic Deduction",
  characteristics: ["action"],
  text: "Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.",
  type: "action",
  abilities: [
    {
      name: "Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.",
      type: "resolution",
      resolveEffectsIndividually: true,
      effects: [
        drawXCards(3),
        putCardFromYourHandOnTheTopOfYourDeck,
        putCardFromYourHandOnTheTopOfYourDeck,
      ],
    },
  ],
  flavour:
    "A security device! Easily defeated, of course. Once I make room for the crown, I... can... bring... it... to... him.",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Elodie Mondoloni",
  number: 94,
  set: "SSK",
  rarity: "common",
};
