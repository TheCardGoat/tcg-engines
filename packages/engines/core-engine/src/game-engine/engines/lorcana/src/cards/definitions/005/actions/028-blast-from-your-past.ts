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

export const blastFromYourPast: LorcanaActionCardDefinition = {
  id: "zt6",
  name: "Blast From Your Past",
  characteristics: ["action", "song"],
  text: "_(A character with cost 6 or more can {E} to sing this song for free.)_\nName a card. Return all character cards with that name from your discard to your hand.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      nameACard: true,
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "discard" },
              { filter: "type", value: "character" },
              { filter: "owner", value: "self" },
              {
                filter: "name-a-card",
              },
            ],
          },
        },
      ],
    },
  ],
  colors: ["amber"],
  cost: 6,
  illustrator: "Nicola Saviori",
  number: 28,
  set: "SSK",
  rarity: "super_rare",
};
