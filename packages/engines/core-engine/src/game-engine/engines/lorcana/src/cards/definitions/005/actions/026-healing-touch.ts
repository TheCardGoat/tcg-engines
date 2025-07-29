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

export const healingTouch: LorcanaActionCardDefinition = {
  id: "i7a",
  name: "Healing Touch",
  characteristics: ["action"],
  text: "Remove up to 4 damage from chosen character. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Remove up to 4 damage from chosen character. Draw a card.",
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "heal",
          amount: 4,
          target: chosenCharacter,
        },
        drawACard,
      ],
    },
  ],
  flavour:
    "The heart is not so easily changed, but the head can be persuaded.\n—Grand Pabbie",
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  illustrator: "Mariana Moreno",
  number: 26,
  set: "SSK",
  rarity: "common",
};
