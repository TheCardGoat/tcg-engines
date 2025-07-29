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

export const breakFree: LorcanaActionCardDefinition = {
  id: "qdj",
  name: "Break Free",
  characteristics: ["action"],
  text: "Deal 1 damage to chosen character of yours. They gain **Rush** and get +1 {S} this turn. _(They can challenge the turn they’re played.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Deal 1 damage to chosen character of yours. They gain **Rush** and get +1 {S} this turn. _(They can challenge the turn they’re played.)_",
      effects: [
        {
          type: "damage",
          amount: 1,
          target: chosenCharacterOfYours,
        },
        {
          type: "attribute",
          attribute: "strength",
          amount: 1,
          modifier: "add",
          duration: "turn",
          target: chosenCharacterOfYours,
        },
        chosenCharacterGainsRush,
      ],
    },
  ],
  flavour: "Tink darted from the shattered lantern in the blink of an eye.",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Brian Kesinger",
  number: 127,
  set: "SSK",
  rarity: "common",
};
