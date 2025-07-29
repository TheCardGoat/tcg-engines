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

export const youreWelcome: LorcanitoActionCard = {
  id: "tri",
  name: "You're Welcome",
  characteristics: ["action", "song"],
  text: "_(A character with cost 4 or more can {E} to sing this song for free.)_<br>\nShuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
  type: "action",
  abilities: [
    {
      name: "Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
      type: "resolution",
      dependentEffects: true,
      resolveEffectsIndividually: true,
      effects: [
        {
          // TODO: REVISIT THIS, this is hacky
          type: "from-target-card-to-target-player",
          player: "card-owner",
          target: chosenCharacterItemOrLocation,
          effects: [
            drawXCards(2),
            {
              type: "shuffle",
              target: chosenCharacterItemOrLocation,
            },
          ],
          // TODO: Fix this
        } as unknown as TargetCardEffect,
      ],
    },
  ],
  flavour: "I make everything happen!",
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  illustrator: "César Vergara",
  number: 96,
  set: "SSK",
  rarity: "uncommon",
};
