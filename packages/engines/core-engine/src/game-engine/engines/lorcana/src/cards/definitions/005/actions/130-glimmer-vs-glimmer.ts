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

export const glimmerVsGlimmer: LorcanaActionCardDefinition = {
  id: "opx",
  missingTestCase: true,
  name: "Glimmer VS Glimmer",
  characteristics: ["action"],
  text: "Banish chosen character of yours to banish chosen character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      dependentEffects: true,
      resolveEffectsIndividually: true,
      effects: [banishChosenOpposingCharacter, banishChosenCharacterOfYours],
    },
  ],
  flavour:
    'Hades: "Listen, kid. If I’m gettin’ banished back to the lorebook, you’re going with me."\nHercules: "We’ll see about that."',
  colors: ["ruby"],
  cost: 4,
  illustrator: "Ian MacDonald",
  number: 130,
  set: "SSK",
  rarity: "uncommon",
};
