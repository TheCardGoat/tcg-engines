import { expect, test } from "bun:test";
import {
  DURING_THEIR_NEXT_TURN,
  FOR_THE_REST_OF_THIS_TURN,
  THIS_TURN,
  UNTIL_START_OF_YOUR_NEXT_TURN,
} from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  banishEffect,
  challengeOverrideEffect,
  conditionalTargetEffect,
  dealDamageEffect,
  discardCardEffect,
  drawCardEffect,
  drawThenDiscardEffect,
  exertCardEffect,
  gainLoreEffect,
  gainsAbilityEffect,
  getEffect,
  loseLoreEffect,
  modalEffect,
  putCardEffect,
  readyAndRestrictQuestEffect,
  removeDamageEffect,
  returnCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { recklessAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/recklessAbility";
import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import { singerTogetherAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singTogetherAbility";
import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import {
  allBodyGuardCharactersTarget,
  allCharactersTarget,
  allItemsTarget,
  allOpposingCharactersTarget,
  anyNumberOfChosenCharacters,
  anyNumberOfYourItems,
  cardNamedTarget,
  chosenActionFromDiscardTarget,
  chosenCharacterFromDiscardTarget,
  chosenCharacterItemOrLocationWithCost2OrLessTarget,
  chosenCharacterOfYoursTarget,
  chosenCharacterOrItemWithCost2OrLessTarget,
  chosenCharacterOrLocationTarget,
  chosenCharacterTarget,
  chosenCharacterWhoHasChallengedTarget,
  chosenCharacterWithCost2OrLessFromDiscardTarget,
  chosenCharacterWithLessStrengthThanPreviousTarget,
  chosenCharacterWithTarget,
  chosenDamagedCharacterTarget,
  chosenExertedCharacterTarget,
  chosenItemFromDiscardTarget,
  chosenItemOrLocationTarget,
  chosenItemTarget,
  chosenLocationTarget,
  upToTarget,
  yourCharactersInPlayFilter,
  yourCharactersTarget,
  yourCharacterWithKeywordTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import {
  chosenPlayerTarget,
  eachOpponentTarget,
  selfPlayerTarget,
  targetOwnerTarget,
  youPlayerTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import {
  type DynamicValue,
  type LorcanaAbility,
  upToValue,
} from "../../ability-types";
import { AbilityBuilder } from "../ability-builder";

export const actionTexts: Array<
  [string, LorcanaAbility[], boolean | undefined]
> = [
  [
    "All opposing characters get -2 {S} until the start of your next turn.",
    [
      {
        type: "static",
        text: "All opposing characters get -2 {S} until the start of your next turn.",
        targets: [allOpposingCharactersTarget],
        effects: [
          getEffect({
            attribute: "strength",
            value: -2,
            duration: UNTIL_START_OF_YOUR_NEXT_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Banish all characters.",
    [
      {
        type: "static",
        text: "Banish all characters.",
        targets: [allCharactersTarget],
        effects: [banishEffect()],
      },
    ],
    true,
  ],
  [
    "Banish all items.",
    [
      {
        type: "static",
        text: "Banish all items.",
        targets: [allItemsTarget],
        effects: [banishEffect()],
      },
    ],
    true,
  ],
  [
    "Banish any number of your items, then draw a card for each item banished this way.",
    [
      {
        type: "static",
        text: "Banish any number of your items, then draw a card for each item banished this way.",
        effects: [
          banishEffect({
            targets: [anyNumberOfYourItems],
            followedBy: drawCardEffect({
              targets: [selfPlayerTarget],
              value: {
                type: "count",
                previousEffectTargets: true,
              } as DynamicValue,
            }),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Banish chosen character of yours to banish chosen character.",
    [
      {
        type: "static",
        text: "Banish chosen character of yours to banish chosen character.",
        effects: [
          banishEffect({
            targets: [chosenCharacterOfYoursTarget],
            followedBy: banishEffect({ targets: [chosenCharacterTarget] }),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Banish chosen character who was challenged this turn.",
    [
      {
        type: "static",
        text: "Banish chosen character who was challenged this turn.",
        targets: [chosenCharacterWhoHasChallengedTarget],
        effects: [banishEffect()],
      },
    ],
    true,
  ],
  [
    "Banish chosen character with 2 {S} or less.",
    [
      {
        type: "static",
        text: "Banish chosen character with 2 {S} or less.",
        targets: [
          chosenCharacterWithTarget({
            attribute: "strength",
            comparison: "lte",
            value: 2,
          }),
        ],
        effects: [banishEffect()],
      },
    ],
    true,
  ],
  [
    "Banish chosen character with 5 {S} or more.",
    [
      {
        type: "static",
        text: "Banish chosen character with 5 {S} or more.",
        targets: [
          chosenCharacterWithTarget({
            attribute: "strength",
            comparison: "gte",
            value: 5,
          }),
        ],
        effects: [banishEffect()],
      },
    ],
    true,
  ],
  [
    "Banish chosen character, then return an item card from your discard to your hand.",
    [
      {
        type: "static",
        text: "Banish chosen character, then return an item card from your discard to your hand.",
        effects: [
          banishEffect({
            targets: [chosenCharacterTarget],
            followedBy: returnCardEffect({
              to: "hand",
              from: "discard",
              targets: [chosenItemFromDiscardTarget],
            }),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Banish chosen character.",
    [
      {
        type: "static",
        text: "Banish chosen character.",
        targets: [chosenCharacterTarget],
        effects: [banishEffect()],
      },
    ],
    true,
  ],
  [
    "Banish chosen character. Draw a card.",
    [
      {
        type: "static",
        text: "Banish chosen character. Draw a card.",
        effects: [
          banishEffect({ targets: [chosenCharacterTarget] }),
          drawCardEffect({ targets: [selfPlayerTarget] }),
        ],
      },
    ],
    true,
  ],
  [
    "Banish chosen damaged character.",
    [
      {
        type: "static",
        text: "Banish chosen damaged character.",
        targets: [chosenDamagedCharacterTarget],
        effects: [banishEffect()],
      },
    ],
    true,
  ],
  [
    "Banish chosen item of yours to deal 5 damage to chosen character.",
    [
      {
        type: "static",
        text: "Banish chosen item of yours to deal 5 damage to chosen character.",
        effects: [
          banishEffect({
            targets: [chosenItemTarget],
            followedBy: dealDamageEffect({
              targets: [chosenCharacterTarget],
              value: 5,
            }),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Banish chosen item. Draw a card.",
    [
      {
        type: "static",
        text: "Banish chosen item. Draw a card.",
        targets: [chosenItemTarget],
        effects: [banishEffect(), drawCardEffect()],
      },
    ],
    true,
  ],
  [
    "Banish chosen item. Its owner gains 2 lore.",
    [
      {
        type: "static",
        text: "Banish chosen item. Its owner gains 2 lore.",
        effects: [
          banishEffect({
            targets: [chosenItemTarget],
            followedBy: gainLoreEffect({
              targets: [targetOwnerTarget],
              value: 2,
            }),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Banish chosen item.",
    [
      {
        type: "static",
        text: "Banish chosen item.",
        targets: [chosenItemTarget],
        effects: [banishEffect()],
      },
    ],
    true,
  ],
  [
    "Banish chosen location or item.",
    [
      {
        type: "static",
        text: "Banish chosen location or item.",
        effects: [
          banishEffect({
            targets: [chosenItemOrLocationTarget],
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Banish chosen Villain of yours to banish chosen character.",
    [
      {
        type: "static",
        text: "Banish chosen Villain of yours to banish chosen character.",
        effects: [
          banishEffect({
            targets: [
              {
                type: "card",
                cardType: "character",
                withClassification: "villain",
                owner: "self",
                count: 1,
              },
            ],
            followedBy: banishEffect({ targets: [chosenCharacterTarget] }),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Banish one of your characters with **Reckless** to banish chosen character with less {S} than that character.",
    [
      {
        type: "static",
        text: "Banish one of your characters with **Reckless** to banish chosen character with less {S} than that character.",
        effects: [
          banishEffect({
            targets: [yourCharacterWithKeywordTarget("reckless")],
            followedBy: banishEffect({
              targets: [chosenCharacterWithLessStrengthThanPreviousTarget()],
            }),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Choose one:\n• Deal 1 damage to each opposing character without **Evasive**.\n• Deal 3 damage to each opposing character with **Evasive**.",
    [
      {
        type: "static",
        text: "Choose one:\n• Deal 1 damage to each opposing character without **Evasive**.\n• Deal 3 damage to each opposing character with **Evasive**.",
        effects: [
          modalEffect([
            {
              text: "Deal 1 damage to each opposing character without Evasive.",
              effects: [
                dealDamageEffect({
                  targets: [
                    {
                      type: "card",
                      cardType: "character",
                      owner: "opponent",
                      withKeyword: undefined, // TODO: this is wrong, we need a way to specify "without keyword"
                    },
                  ],
                  value: 1,
                }),
              ],
            },
            {
              text: "Deal 3 damage to each opposing character with Evasive.",
              effects: [
                dealDamageEffect({
                  targets: [
                    {
                      type: "card",
                      cardType: "character",
                      owner: "opponent",
                      withKeyword: "evasive",
                    },
                  ],
                  value: 3,
                }),
              ],
            },
          ]),
        ],
      },
    ],
    true,
  ],
  [
    "Choose one:\n• Remove up to 3 damage from chosen character.\n• Remove up to 3 damage from each of your characters with Bodyguard.",
    [
      {
        type: "static",
        text: "Choose one:\n• Remove up to 3 damage from chosen character.\n• Remove up to 3 damage from each of your characters with Bodyguard.",
        effects: [
          modalEffect([
            {
              text: "Remove up to 3 damage from chosen character.",
              effects: [
                removeDamageEffect({
                  targets: [chosenCharacterTarget],
                  value: upToValue(3),
                }),
              ],
            },
            {
              text: "Remove up to 3 damage from each of your characters with Bodyguard.",
              effects: [
                removeDamageEffect({
                  targets: [allBodyGuardCharactersTarget],
                  value: upToValue(3),
                }),
              ],
            },
          ]),
        ],
      },
    ],
    true,
  ],
  [
    "Choose one:\n- Draw 2 cards.\n- Each opponent chooses and discards a card.",
    [
      {
        type: "static",
        text: "Choose one:\n- Draw 2 cards.\n- Each opponent chooses and discards a card.",
        effects: [
          modalEffect([
            {
              text: "Draw 2 cards.",
              effects: [drawCardEffect({ value: 2 })],
            },
            {
              text: "Each opponent chooses and discards a card.",
              effects: [
                discardCardEffect({ value: 1, targets: eachOpponentTarget }),
              ],
            },
          ]),
        ],
      },
    ],
    true,
  ],
  [
    "Choose one:\n- Return chosen character to their player's hand.\n- Put a Pull the Lever! card from your discard pile on the bottom of your deck to put chosen character on the bottom of their owner's deck.",
    [
      {
        type: "static",
        text: "Choose one:\n- Return chosen character to their player's hand.\n- Put a Pull the Lever! card from your discard pile on the bottom of your deck to put chosen character on the bottom of their owner's deck.",
        effects: [
          modalEffect([
            {
              text: "Return chosen character to their player's hand.",
              effects: [
                returnCardEffect({
                  to: "hand",
                  targets: [chosenCharacterTarget],
                }),
              ],
            },
            {
              text: "Put a Pull the Lever! card from your discard pile on the bottom of your deck to put chosen character on the bottom of their owner's deck.",
              effects: [
                putCardEffect({
                  to: "deck",
                  from: "discard",
                  position: "bottom",
                  targets: [cardNamedTarget({ name: "Pull the Lever!" })],
                  followedBy: putCardEffect({
                    to: "deck",
                    from: "play",
                    position: "bottom",
                    targets: [chosenCharacterTarget],
                  }),
                }),
              ],
            },
          ]),
        ],
      },
    ],
    true,
  ],
  [
    "Choose one:\n\n· Deal 2 damage to chosen character.\n\n· Banish chosen item.",
    [
      {
        type: "static",
        text: "Choose one:\n\n· Deal 2 damage to chosen character.\n\n· Banish chosen item.",
        effects: [
          modalEffect([
            {
              text: "Deal 2 damage to chosen character.",
              effects: [
                dealDamageEffect({
                  targets: [chosenCharacterTarget],
                  value: 2,
                }),
              ],
            },
            {
              text: "Banish chosen item.",
              effects: [banishEffect({ targets: [chosenItemTarget] })],
            },
          ]),
        ],
      },
    ],
    true,
  ],
  [
    "Choose one:\n· Banish chosen item.\n· Deal 2 damage to chosen damaged character.",
    [
      {
        type: "static",
        text: "Choose one:\n· Banish chosen item.\n· Deal 2 damage to chosen damaged character.",
        effects: [
          modalEffect([
            {
              text: "Banish chosen item.",
              effects: [banishEffect({ targets: [chosenItemTarget] })],
            },
            {
              text: "Deal 2 damage to chosen damaged character.",
              effects: [
                dealDamageEffect({
                  targets: [chosenDamagedCharacterTarget],
                  value: 2,
                }),
              ],
            },
          ]),
        ],
      },
    ],
    true,
  ],
  [
    "Choose one:\n* Ready chosen item.\n* Ready chosen Robot character. They can't quest for the rest of this turn.",
    [
      {
        type: "static",
        text: "Choose one:\n* Ready chosen item.\n* Ready chosen Robot character. They can't quest for the rest of this turn.",
        effects: [
          modalEffect([
            {
              text: "Ready chosen item.",
              effects: [{ type: "ready", targets: [chosenItemTarget] }],
            },
            {
              text: "Ready chosen Robot character. They can't quest for the rest of this turn.",
              effects: readyAndRestrictQuestEffect({
                type: "card",
                cardType: "character",
                withClassification: "robot",
                count: 1,
              }),
            },
          ]),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character can challenge ready characters this turn.",
    [
      {
        type: "static",
        text: "Chosen character can challenge ready characters this turn.",
        targets: [chosenCharacterTarget],
        effects: [
          challengeOverrideEffect({
            canChallenge: "ready",
            duration: THIS_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character can't challenge during their next turn. Draw a card.",
    [
      {
        type: "static",
        text: "Chosen character can't challenge during their next turn. Draw a card.",
        effects: [
          {
            type: "restrict",
            restriction: "challenge",
            duration: DURING_THEIR_NEXT_TURN,
            targets: [chosenCharacterTarget],
          },
          drawCardEffect({ targets: [selfPlayerTarget] }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gains **Challenger** +2 and **Resist** +2 this turn. _(They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)_",
    [
      {
        type: "static",
        text: "Chosen character gains **Challenger** +2 and **Resist** +2 this turn. _(They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)_",
        targets: [chosenCharacterTarget],
        effects: [
          gainsAbilityEffect({
            ability: challengerAbility(2),
            duration: THIS_TURN,
          }),
          gainsAbilityEffect({
            ability: resistAbility(2),
            duration: THIS_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gains **Challenger** +3 and When this character is banished in a challenge, return this card to your hand this turn. _(They get +3 {S} while challenging.)_",
    [
      {
        type: "static",
        text: "Chosen character gains **Challenger** +3 and When this character is banished in a challenge, return this card to your hand this turn. _(They get +3 {S} while challenging.)_",
        targets: [chosenCharacterTarget],
        effects: [
          gainsAbilityEffect({ ability: challengerAbility(3) }),
          // TODO: Skipping implementation - requires complex triggered ability for "when banished in challenge" condition
          gainsAbilityEffect({ ability: challengerAbility(0) }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gains **Challenger** +3 this turn.",
    [
      {
        type: "static",
        text: "Chosen character gains **Challenger** +3 this turn.",
        targets: [chosenCharacterTarget],
        effects: [
          gainsAbilityEffect({
            ability: challengerAbility(3),
            duration: THIS_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gains **Evasive** until the start of your next turn.",
    [
      {
        type: "static",
        text: "Chosen character gains Evasive until the start of your next turn.",
        targets: [chosenCharacterTarget],
        effects: [
          gainsAbilityEffect({
            ability: evasiveAbility,
            duration: UNTIL_START_OF_YOUR_NEXT_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
    [
      {
        type: "static",
        text: "Chosen character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
        targets: [chosenCharacterTarget],
        effects: [
          gainsAbilityEffect({
            ability: recklessAbility,
            duration: DURING_THEIR_NEXT_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gains **Resist** +1 and **Evasive** this turn.",
    [
      {
        type: "static",
        text: "Chosen character gains **Resist** +1 and **Evasive** this turn.",
        targets: [chosenCharacterTarget],
        effects: [
          gainsAbilityEffect({
            ability: resistAbility(1),
            duration: FOR_THE_REST_OF_THIS_TURN,
          }),
          gainsAbilityEffect({
            ability: evasiveAbility,
            duration: FOR_THE_REST_OF_THIS_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gains **Resist** +2 until the start of your next turn. If a Hero character is chosen, they may also challenge ready characters this turn.",
    [
      {
        type: "static",
        text: "Chosen character gains **Resist** +2 until the start of your next turn. If a Hero character is chosen, they may also challenge ready characters this turn.",
        targets: [chosenCharacterTarget],
        effects: [
          gainsAbilityEffect({
            ability: resistAbility(2),
            duration: UNTIL_START_OF_YOUR_NEXT_TURN,
          }),
          conditionalTargetEffect({
            targetCondition: {
              type: "hasClassification",
              classification: "hero",
            },
            effect: challengeOverrideEffect({
              canChallenge: "ready",
              duration: UNTIL_START_OF_YOUR_NEXT_TURN,
            }),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gains **Rush** this turn.",
    [
      {
        type: "static",
        text: "Chosen character gains **Rush** this turn.",
        targets: [chosenCharacterTarget],
        effects: [gainsAbilityEffect({ ability: rushAbility })],
      },
    ],
    true,
  ],
  [
    "Chosen character gains **Support** this turn. Draw a card.",
    [
      {
        type: "static",
        text: "Chosen character gains Support this turn. Draw a card.",
        effects: [
          gainsAbilityEffect({
            targets: [chosenCharacterTarget],
            ability: supportAbility,
            duration: FOR_THE_REST_OF_THIS_TURN,
          }),
          drawCardEffect({ targets: [selfPlayerTarget] }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gains **Support** this turn. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
    [
      {
        type: "static",
        text: "Chosen character gains Support this turn. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
        targets: [chosenCharacterTarget],
        effects: [
          gainsAbilityEffect({
            ability: supportAbility,
            duration: FOR_THE_REST_OF_THIS_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gains **Ward** and **Evasive** until the start of your next turn. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_",
    [
      {
        type: "static",
        text: "Chosen character gains Ward and Evasive until the start of your next turn. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_",
        targets: [chosenCharacterTarget],
        effects: [
          gainsAbilityEffect({
            ability: wardAbility,
            duration: UNTIL_START_OF_YOUR_NEXT_TURN,
          }),
          gainsAbilityEffect({
            ability: evasiveAbility,
            duration: UNTIL_START_OF_YOUR_NEXT_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gains Bodyguard until the start of your next turn.",
    [
      {
        type: "static",
        text: "Chosen character gains Bodyguard until the start of your next turn.",
        targets: [chosenCharacterTarget],
        effects: [
          gainsAbilityEffect({
            ability: bodyguardAbility,
            duration: UNTIL_START_OF_YOUR_NEXT_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gains Evasive until the start of your next turn.",
    [
      {
        type: "static",
        text: "Chosen character gains Evasive until the start of your next turn.",
        targets: [chosenCharacterTarget],
        effects: [
          gainsAbilityEffect({
            ability: bodyguardAbility,
            duration: UNTIL_START_OF_YOUR_NEXT_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gains Resist +2 until the start of your next turn. Draw a card. (Damage dealt to them is reduced by 2.)",
    [
      {
        type: "static",
        text: "Chosen character gains Resist +2 until the start of your next turn. Draw a card. (Damage dealt to them is reduced by 2.)",
        targets: [chosenCharacterTarget],
        effects: [
          gainsAbilityEffect({
            ability: resistAbility(2),
            duration: UNTIL_START_OF_YOUR_NEXT_TURN,
          }),
          drawCardEffect({ targets: [selfPlayerTarget] }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gains Support this turn. Draw a card.",
    [
      {
        type: "static",
        text: "Chosen character gains Support this turn. Draw a card.",
        effects: [
          gainsAbilityEffect({
            targets: [chosenCharacterTarget],
            ability: supportAbility,
            duration: THIS_TURN,
          }),
          drawCardEffect({ targets: [selfPlayerTarget] }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gets +1 {L} this turn.",
    [
      {
        type: "static",
        text: "Chosen character gets +1 {L} this turn.",
        targets: [chosenCharacterTarget],
        effects: [
          getEffect({
            attribute: "lore",
            value: 1,
            targets: chosenCharacterTarget,
            duration: THIS_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gets +1 {S} this turn for each character you have in play.",
    [
      {
        type: "static",
        text: "Chosen character gets +1 {S} this turn for each character you have in play.",
        targets: [chosenCharacterTarget],
        effects: [
          getEffect({
            attribute: "strength",
            value: {
              type: "count",
              filter: yourCharactersInPlayFilter,
            } as DynamicValue,
            targets: chosenCharacterTarget,
            duration: THIS_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gets +1 {S} this turn. Draw a card.",
    [
      {
        type: "static",
        text: "Chosen character gets +1 {S} this turn. Draw a card.",
        targets: [chosenCharacterTarget],
        effects: [
          getEffect({
            attribute: "strength",
            value: 1,
            targets: chosenCharacterTarget,
            duration: FOR_THE_REST_OF_THIS_TURN,
          }),
          drawCardEffect({ targets: [selfPlayerTarget] }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gets +2 {S} this turn. If a Pirate character is chosen, they get +3 {S} instead.",
    [
      {
        type: "static",
        text: "Chosen character gets +2 {S} this turn. If a Pirate character is chosen, they get +3 {S} instead.",
        targets: [chosenCharacterTarget],
        effects: [
          conditionalTargetEffect({
            targetCondition: {
              type: "hasClassification",
              classification: "pirate",
            },
            effect: getEffect({
              attribute: "strength",
              value: 3,
              duration: FOR_THE_REST_OF_THIS_TURN,
            }),
            elseEffect: getEffect({
              attribute: "strength",
              value: 2,
              duration: FOR_THE_REST_OF_THIS_TURN,
            }),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gets +2 {S} this turn. If a Villain character is chosen, they get +3 {S} instead.",
    [
      {
        type: "static",
        text: "Chosen character gets +2 {S} this turn. If a Villain character is chosen, they get +3 {S} instead.",
        targets: [chosenCharacterTarget],
        effects: [
          conditionalTargetEffect({
            targetCondition: {
              type: "hasClassification",
              classification: "villain",
            },
            effect: getEffect({
              attribute: "strength",
              value: 3,
              duration: FOR_THE_REST_OF_THIS_TURN,
            }),
            elseEffect: getEffect({
              attribute: "strength",
              value: 2,
              duration: FOR_THE_REST_OF_THIS_TURN,
            }),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gets +2 {S} this turn.",
    [
      {
        type: "static",
        text: "Chosen character gets +2 {S} this turn.",
        targets: [chosenCharacterTarget],
        effects: [
          getEffect({
            attribute: "strength",
            value: 2,
            targets: chosenCharacterTarget,
            duration: FOR_THE_REST_OF_THIS_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gets -2 {S} this turn. Chosen character of yours gains Evasive this turn.",
    [
      {
        type: "static",
        text: "Chosen character gets -2 {S} this turn. Chosen character of yours gains Evasive this turn.",
        effects: [
          getEffect({
            targets: [chosenCharacterTarget],
            attribute: "strength",
            value: -2,
            duration: FOR_THE_REST_OF_THIS_TURN,
          }),
          gainsAbilityEffect({
            targets: [chosenCharacterOfYoursTarget],
            ability: evasiveAbility,
            duration: FOR_THE_REST_OF_THIS_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gets -2 {S} this turn. Draw a card.",
    [
      {
        type: "static",
        text: "Chosen character gets -2 {S} this turn. Draw a card.",
        effects: [
          getEffect({
            targets: [chosenCharacterTarget],
            attribute: "strength",
            value: -2,
            duration: FOR_THE_REST_OF_THIS_TURN,
          }),
          drawCardEffect({ targets: [selfPlayerTarget] }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gets -2 {S} this turn.",
    [
      {
        type: "static",
        text: "Chosen character gets -2 {S} this turn.",
        targets: [chosenCharacterTarget],
        effects: [
          getEffect({
            attribute: "strength",
            value: -2,
            targets: chosenCharacterTarget,
            duration: FOR_THE_REST_OF_THIS_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gets -3 {S} this turn.",
    [
      {
        type: "static",
        text: "Chosen character gets -3 {S} this turn.",
        targets: [chosenCharacterTarget],
        effects: [
          getEffect({
            attribute: "strength",
            value: -3,
            targets: chosenCharacterTarget,
            duration: FOR_THE_REST_OF_THIS_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen character gets -4 {S} until the start of your next turn.",
    [
      {
        type: "static",
        text: "Chosen character gets -4 {S} until the start of your next turn.",
        targets: [chosenCharacterTarget],
        effects: [
          getEffect({
            attribute: "strength",
            value: -4,
            targets: chosenCharacterTarget,
            duration: UNTIL_START_OF_YOUR_NEXT_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen damaged character gets +3 {S} this turn.",
    [
      {
        type: "static",
        text: "Chosen damaged character gets +3 {S} this turn.",
        targets: [chosenDamagedCharacterTarget],
        effects: [
          getEffect({
            attribute: "strength",
            value: 3,
            duration: THIS_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen exerted character can't ready at the start of their next turn.",
    [
      {
        type: "static",
        text: "Chosen exerted character can't ready at the start of their next turn.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn.",
    [
      {
        type: "static",
        text: "Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn.",
        effects: [
          discardCardEffect({
            targets: [chosenPlayerTarget],
            value: 1,
          }),
          getEffect({
            targets: [chosenCharacterTarget],
            attribute: "strength",
            value: 2,
            duration: THIS_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen opponent loses 1 lore. Gain 1 lore.",
    [
      {
        type: "static",
        text: "Chosen opponent loses 1 lore. Gain 1 lore.",
        effects: [
          loseLoreEffect({
            targets: [chosenPlayerTarget],
            value: 1,
          }),
          gainLoreEffect({
            targets: [selfPlayerTarget],
            value: 1,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Chosen opponent reveals their hand and discards a non-character card of your choice.",
    [
      {
        type: "static",
        text: "Chosen opponent reveals their hand and discards a non-character card of your choice.",
        targets: [],
        effects: [],
        // TODO: Skipping implementation - requires complex reveal hand and player choice mechanics
      },
    ],
    true,
  ],
  [
    "Chosen character of yours can't be challenged until the start of your next turn.",
    [
      {
        type: "static",
        text: "Chosen character of yours can't be challenged until the start of your next turn.",
        targets: [],
        effects: [],
        // TODO: Skipping implementation - unsure about "can't be challenged" restriction type
      },
    ],
    true,
  ],
  [
    "Chosen character of yours gets +2 {S} this turn. They may move to a location for free.",
    [
      {
        type: "static",
        text: "Chosen character of yours gets +2 {S} this turn. They may move to a location for free.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Count the number of characters you have in play. Chosen character loses {S} equal to that number until the start of your next turn.",
    [
      {
        type: "static",
        text: "Count the number of characters you have in play. Chosen character loses {S} equal to that number until the start of your next turn.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Count the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.",
    [
      {
        type: "static",
        text: "Count the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Deal 1 damage to chosen character for each exerted character you have in play.",
    [
      {
        type: "static",
        text: "Deal 1 damage to chosen character for each exerted character you have in play.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Deal 1 damage to chosen character of yours. They gain **Rush** and get +1 {S} this turn. _(They can challenge the turn they're played.)_",
    [
      {
        type: "static",
        text: "Deal 1 damage to chosen character of yours. They gain **Rush** and get +1 {S} this turn. _(They can challenge the turn they're played.)_",
        targets: [chosenCharacterOfYoursTarget],
        effects: [
          dealDamageEffect({
            targets: [chosenCharacterOfYoursTarget],
            value: 1,
          }),
          gainsAbilityEffect({
            ability: rushAbility,
            duration: FOR_THE_REST_OF_THIS_TURN,
          }),
          getEffect({
            attribute: "strength",
            value: 1,
            duration: FOR_THE_REST_OF_THIS_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Deal 1 damage to chosen character. Draw a card.",
    [
      {
        type: "static",
        text: "Deal 1 damage to chosen character. Draw a card.",
        effects: [
          dealDamageEffect({ targets: chosenCharacterTarget, value: 1 }),
          drawCardEffect({ targets: [selfPlayerTarget] }),
        ],
      },
    ],
    true,
  ],
  [
    "Deal 1 damage to each opposing character. You may banish chosen location.",
    [
      {
        type: "static",
        text: "Deal 1 damage to each opposing character. You may banish chosen location.",
        effects: [
          dealDamageEffect({
            targets: [allOpposingCharactersTarget],
            value: 1,
          }),
          {
            type: "banish",
            targets: [chosenLocationTarget],
            optional: true,
          },
        ],
      },
    ],
    true,
  ],
  [
    "Deal 1 damage to up to 2 chosen characters.",
    [
      {
        type: "static",
        text: "Deal 1 damage to up to 2 chosen characters.",
        effects: [
          dealDamageEffect({
            value: 1,
            targets: upToTarget({
              target: chosenCharacterTarget,
              upTo: 2,
            }),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Deal 2 damage to chosen character of yours to deal 2 damage to another chosen character.",
    [
      {
        type: "static",
        text: "Deal 2 damage to chosen character of yours to deal 2 damage to another chosen character.",
        targets: [],
        effects: [],
        // TODO: Skipping implementation - requires targeting two different characters
      },
    ],
    true,
  ],
  [
    "Deal 2 damage to chosen character or location.",
    [
      {
        type: "static",
        text: "Deal 2 damage to chosen character or location.",
        targets: [chosenCharacterOrLocationTarget],
        effects: [dealDamageEffect({ value: 2 })],
      },
    ],
    true,
  ],
  [
    "Deal 2 damage to chosen character. Draw a card.",
    [
      {
        type: "static",
        text: "Deal 2 damage to chosen character. Draw a card.",
        effects: [
          dealDamageEffect({ targets: chosenCharacterTarget, value: 2 }),
          drawCardEffect({ targets: [selfPlayerTarget] }),
        ],
      },
    ],
    true,
  ],
  [
    "Deal 2 damage to chosen character. Then, you may choose and discard a card to deal 2 damage to another chosen character.",
    [
      {
        type: "static",
        text: "Deal 2 damage to chosen character. Then, you may choose and discard a card to deal 2 damage to another chosen character.",
        effects: [
          dealDamageEffect({
            targets: [chosenCharacterTarget],
            value: 2,
          }),
          {
            type: "conditional",
            parameters: {
              cost: discardCardEffect({
                targets: [selfPlayerTarget],
                value: 1,
              }),
              effect: dealDamageEffect({
                targets: [chosenCharacterTarget],
                value: 2,
              }),
            },
            optional: true,
          },
        ],
      },
    ],
    true,
  ],
  [
    "Deal 2 damage to chosen character.",
    [
      {
        type: "static",
        text: "Deal 2 damage to chosen character.",
        targets: [chosenCharacterTarget],
        effects: [
          dealDamageEffect({ targets: chosenCharacterTarget, value: 2 }),
        ],
      },
    ],
    true,
  ],
  [
    "Deal 2 damage to chosen damaged character.",
    [
      {
        type: "static",
        text: "Deal 2 damage to chosen damaged character.",
        targets: [chosenDamagedCharacterTarget],
        effects: [
          dealDamageEffect({ targets: chosenDamagedCharacterTarget, value: 2 }),
        ],
      },
    ],
    true,
  ],
  [
    "Deal 2 damage to each opposing character.",
    [
      {
        type: "static",
        text: "Deal 2 damage to each opposing character.",
        targets: [allOpposingCharactersTarget],
        effects: [dealDamageEffect({ value: 2 })],
      },
    ],
    true,
  ],
  [
    "Deal 3 damage to the chosen character.",
    [
      {
        type: "static",
        text: "Deal 3 damage to the chosen character.",
        targets: [chosenCharacterTarget],
        effects: [
          dealDamageEffect({ targets: chosenCharacterTarget, value: 3 }),
        ],
      },
    ],
    true,
  ],
  [
    "Deal 5 damage to chosen character or location.",
    [
      {
        type: "static",
        text: "Deal 5 damage to chosen character or location.",
        targets: [chosenCharacterOrLocationTarget],
        effects: [
          dealDamageEffect({
            targets: chosenCharacterOrLocationTarget,
            value: 5,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Deal damage to chosen character equal to the number of characters you have in play.",
    [
      {
        type: "static",
        text: "Deal damage to chosen character equal to the number of characters you have in play.",
        targets: [],
        effects: [],
        // TODO: Skipping implementation - requires dynamic damage value based on character count
      },
    ],
    true,
  ],
  [
    "Draw 2 cards, then choose and discard 2 cards.",
    [
      {
        type: "static",
        text: "Draw 2 cards, then choose and discard 2 cards.",
        effects: [drawThenDiscardEffect({ draw: 2, discard: 2 })],
      },
    ],
    true,
  ],
  [
    "Draw 2 cards, then choose and discard a card.",
    [
      {
        type: "static",
        text: "Draw 2 cards, then choose and discard a card.",
        effects: [drawThenDiscardEffect({ draw: 2, discard: 1 })],
      },
    ],
    true,
  ],
  [
    "Draw 2 cards.",
    [
      {
        type: "static",
        text: "Draw 2 cards.",
        targets: [selfPlayerTarget],
        effects: [drawCardEffect({ value: 2 })],
      },
    ],
    true,
  ],
  [
    "Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.",
    [
      {
        type: "static",
        text: "Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.",
        targets: [],
        effects: [],
        // TODO: Skipping implementation - requires complex hand manipulation and ordering choices
      },
    ],
    true,
  ],
  [
    "Draw 3 cards.",
    [
      {
        type: "static",
        text: "Draw 3 cards.",
        targets: [selfPlayerTarget],
        effects: [drawCardEffect({ value: 3 })],
      },
    ],
    true,
  ],
  [
    "Draw a card. Chosen character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_",
    [
      {
        type: "static",
        text: "Draw a card. Chosen character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_",
        effects: [
          drawCardEffect({ targets: [selfPlayerTarget] }),
          gainsAbilityEffect({
            targets: [chosenCharacterTarget],
            ability: challengerAbility(2),
            duration: THIS_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Draw a card. Chosen character gains **Reckless** during their next turn._(They can't quest and must challenge if able.)_",
    [
      {
        type: "static",
        text: "Draw a card. Chosen character gains **Reckless** during their next turn._(They can't quest and must challenge if able.)_",
        effects: [
          drawCardEffect({ targets: [selfPlayerTarget] }),
          gainsAbilityEffect({
            targets: [chosenCharacterTarget],
            ability: recklessAbility,
            duration: DURING_THEIR_NEXT_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Draw a card. Chosen character of yours gets +5 {S} this turn. At the end of your turn, banish them.",
    [
      {
        type: "static",
        text: "Draw a card. Chosen character of yours gets +5 {S} this turn. At the end of your turn, banish them.",
        targets: [],
        effects: [],
        // TODO: Skipping implementation - requires end-of-turn trigger to banish
      },
    ],
    true,
  ],
  [
    "Draw a card. Shuffle up to 3 cards from your opponent's discard into your opponent's deck.",
    [
      {
        type: "static",
        text: "Draw a card. Shuffle up to 3 cards from your opponent's discard into your opponent's deck.",
        targets: [],
        effects: [],
        // TODO: Skipping implementation - requires discard pile manipulation
      },
    ],
    true,
  ],
  [
    "Each opponent chooses and banishes one of their characters.",
    [
      {
        type: "static",
        text: "Each opponent chooses and banishes one of their characters.",
        responder: "opponent",
        effects: [
          banishEffect({
            targets: [
              {
                type: "card",
                cardType: "character",
                owner: "self",
                count: 1,
              },
            ],
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Each opponent chooses and discards 2 cards.",
    [
      {
        type: "static",
        text: "Each opponent chooses and discards 2 cards.",
        effects: [
          discardCardEffect({
            targets: [eachOpponentTarget],
            value: 2,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Each opponent chooses and discards a card.",
    [
      {
        type: "static",
        text: "Each opponent chooses and discards a card.",
        effects: [
          discardCardEffect({
            targets: [eachOpponentTarget],
            value: 1,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Each opponent chooses and discards a card. Draw a card.",
    [
      {
        type: "static",
        text: "Each opponent chooses and discards a card. Draw a card.",
        effects: [
          discardCardEffect({ targets: [eachOpponentTarget], value: 1 }),
          drawCardEffect({ targets: [selfPlayerTarget] }),
        ],
      },
    ],
    true,
  ],
  [
    "Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.",
    [
      {
        type: "static",
        text: "Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.",
        responder: "opponent",
        effects: [
          {
            type: "exert",
            targets: [
              {
                type: "card",
                cardType: "character",
                owner: "self",
                count: 1,
              },
            ],
            followedBy: {
              type: "restrict",
              restriction: "ready",
              duration: DURING_THEIR_NEXT_TURN,
              targets: [
                {
                  type: "previousEffectTargets",
                },
              ],
            },
          },
        ],
      },
    ],
    true,
  ],
  [
    "Each opponent chooses one of their characters and deals 2 damage to them.",
    [
      {
        type: "static",
        text: "Each opponent chooses one of their characters and deals 2 damage to them.",
        responder: "opponent",
        effects: [
          dealDamageEffect({
            targets: [
              {
                type: "card",
                cardType: "character",
                owner: "self",
                count: 1,
              },
            ],
            value: 2,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Each opponent chooses one of their characters and deals 4 damage to them.",
    [
      {
        type: "static",
        text: "Each opponent chooses one of their characters and deals 4 damage to them.",
        responder: "opponent",
        effects: [
          dealDamageEffect({
            targets: [
              {
                type: "card",
                cardType: "character",
                owner: "self",
                count: 1,
              },
            ],
            value: 4,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Each opponent loses 1 lore.",
    [
      {
        type: "static",
        text: "Each opponent loses 1 lore.",
        targets: [eachOpponentTarget],
        effects: [loseLoreEffect({ targets: [eachOpponentTarget], value: 1 })],
      },
    ],
    true,
  ],
  [
    "Each opponent may chose and discard a card. For each opponent who doesn't, you gain 2 lore.",
    [
      {
        type: "static",
        text: "Each opponent may chose and discard a card. For each opponent who doesn't, you gain 2 lore.",
        responder: "opponent",
        effects: [
          // TODO: Requires new helper function for optional choice effects
          // optionalChoiceEffect({
          //   choice: discardCardEffect({ value: 1, targets: [selfPlayerTarget] }),
          //   onDecline: gainLoreEffect({ value: 2, targets: [selfPlayerTarget] })
          // })
        ],
      },
    ],
    true,
  ],
  [
    "Each opponent may choose and discard a card. For each opponent who doesn't, you draw a card.",
    [
      {
        type: "static",
        text: "Each opponent may choose and discard a card. For each opponent who doesn't, you draw a card.",
        responder: "opponent",
        effects: [
          // TODO: Requires new helper function for optional choice effects
          // optionalChoiceEffect({
          //   choice: discardCardEffect({ value: 1, targets: [selfPlayerTarget] }),
          //   onDecline: drawCardEffect({ value: 1, targets: [selfPlayerTarget] })
          // })
        ],
      },
    ],
    true,
  ],
  [
    "Each opponent puts the top 2 cards of their deck into their discard.",
    [
      {
        type: "static",
        text: "Each opponent puts the top 2 cards of their deck into their discard.",
        targets: [],
        effects: [],
        // TODO: Skipping implementation - requires mill/deck to discard effect
      },
    ],
    true,
  ],
  [
    "Each opponent reveals their hand. Draw a card.",
    [
      {
        type: "static",
        text: "Each opponent reveals their hand. Draw a card.",
        effects: [
          {
            type: "reveal",
            targets: [eachOpponentTarget],
            zone: "hand",
          },
          drawCardEffect({ targets: [selfPlayerTarget] }),
        ],
      },
    ],
    true,
  ],
  [
    "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.",
    [
      {
        type: "static",
        text: "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.",
        effects: [
          putCardEffect({
            to: "inkwell",
            from: "play",
            targets: [
              {
                type: "card",
                cardType: "character",
                owner: "self",
                count: 1,
              },
            ],
          }),
        ],
      },
      {
        type: "static",
        text: "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.",
        responder: "opponent",
        effects: [
          putCardEffect({
            to: "inkwell",
            from: "play",
            targets: [
              {
                type: "card",
                cardType: "character",
                owner: "self",
                count: 1,
              },
            ],
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Each player discards their hand and draws 7 cards.",
    [
      {
        type: "static",
        text: "Each player discards their hand and draws 7 cards.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Each player draws 3 cards.",
    [
      {
        type: "static",
        text: "Each player draws 3 cards.",
        effects: [
          drawCardEffect({ targets: [selfPlayerTarget], value: 3 }),
          drawCardEffect({ targets: [eachOpponentTarget], value: 3 }),
        ],
      },
    ],
    true,
  ],
  [
    "Each player exerts all the cards in their inkwell. Then each player with more than 3 cards in their inkwell returns cards at random from their inkwell to their hand until they have 3 cards in their inkwell.",
    [
      {
        type: "static",
        text: "Each player exerts all the cards in their inkwell. Then each player with more than 3 cards in their inkwell returns cards at random from their inkwell to their hand until they have 3 cards in their inkwell.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Each player may reveal a character card from their hand and play it for free.",
    [
      {
        type: "static",
        text: "Each player may reveal a character card from their hand and play it for free.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Each player may reveal a character card from their hand and play it for free.",
    [
      {
        type: "static",
        text: "Each player may reveal a character card from their hand and play it for free.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Each player puts the top 3 cards of their deck into their inkwell facedown and exerted.",
    [
      {
        type: "static",
        text: "Each player puts the top 3 cards of their deck into their inkwell facedown and exerted.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Exert all opposing characters. Whenever one of your characters banishes another character in a challenge this turn, gain 2 lore.",
    [
      {
        type: "static",
        text: "Exert all opposing characters. Whenever one of your characters banishes another character in a challenge this turn, gain 2 lore.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.",
    [
      {
        type: "static",
        text: "Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.",
        targets: [],
        effects: [],
        // TODO: Skipping implementation - requires conditional effects based on player choice
      },
    ],
    true,
  ],
  [
    "Exert chosen opposing character. Then chosen character of yours gains **Challenger** +2 this turn. (They get +2 {S} while challenging.)",
    [
      {
        type: "static",
        text: "Exert chosen opposing character. Then chosen character of yours gains **Challenger** +2 this turn. (They get +2 {S} while challenging.)",
        effects: [
          {
            type: "exert",
            targets: [
              {
                type: "card",
                cardType: "character",
                owner: "opponent",
                count: 1,
              },
            ],
          },
          gainsAbilityEffect({
            targets: [chosenCharacterOfYoursTarget],
            ability: challengerAbility(2),
            duration: FOR_THE_REST_OF_THIS_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Exert chosen opposing character.",
    [
      {
        type: "static",
        text: "Exert chosen opposing character.",
        targets: [
          {
            type: "card",
            cardType: "character",
            owner: "opponent",
            count: 1,
          },
        ],
        effects: [
          {
            type: "exert",
          },
        ],
      },
    ],
    true,
  ],
  [
    "{E} one of your characters to deal damage equal to their {S} to chosen character.",
    [
      {
        type: "static",
        text: "{E} one of your characters to deal damage equal to their {S} to chosen character.",
        targets: [],
        effects: [],
        // TODO: Skipping implementation - requires dynamic damage based on character strength
      },
    ],
    true,
  ],
  [
    "For each Sorcerer character you have in play, you pay 1 {I} less to play this action.\nDraw 2 cards.",
    [
      {
        type: "static",
        text: "For each Sorcerer character you have in play, you pay 1 {I} less to play this action.\nDraw 2 cards.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Gain 1 lore for each damaged character opponents have in play.",
    [
      {
        type: "static",
        text: "Gain 1 lore for each damaged character opponents have in play.",
        targets: [],
        effects: [],
        // TODO: Skipping implementation - requires counting damaged characters
      },
    ],
    true,
  ],
  [
    "Gain 1 lore. Draw a card.",
    [
      {
        type: "static",
        text: "Gain 1 lore. Draw a card.",
        effects: [
          gainLoreEffect({ targets: [selfPlayerTarget], value: 1 }),
          drawCardEffect({ targets: [selfPlayerTarget] }),
        ],
      },
    ],
    true,
  ],
  [
    "Gain 2 lore.",
    [
      {
        type: "static",
        text: "Gain 2 lore.",
        targets: [selfPlayerTarget],
        effects: [gainLoreEffect({ targets: [selfPlayerTarget], value: 2 })],
      },
    ],
    true,
  ],
  [
    "Gain lore equal to the damage on chosen character, then banish them.",
    [
      {
        type: "static",
        text: "Gain lore equal to the damage on chosen character, then banish them.",
        targets: [],
        effects: [],
        // TODO: Skipping implementation - requires dynamic lore value based on character damage
      },
    ],
    true,
  ],
  [
    "If chosen opponent has more cards in their hand than you, draw cards until you have the same number.",
    [
      {
        type: "static",
        text: "If chosen opponent has more cards in their hand than you, draw cards until you have the same number.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "If you have no cards in your hand, draw until you have 3 cards in your hand. Otherwise, choose and discard any number of cards, then draw that many cards.",
    [
      {
        type: "static",
        text: "If you have no cards in your hand, draw until you have 3 cards in your hand. Otherwise, choose and discard any number of cards, then draw that many cards.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.",
    [
      {
        type: "static",
        text: "Look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.",
        effects: [
          {
            type: "scry",
            parameters: {
              lookAt: 2,
              destinations: [
                {
                  zone: "hand",
                  count: 1,
                },
                {
                  zone: "inkwell",
                  count: 1,
                  exerted: true,
                },
              ],
            },
          },
        ],
      },
    ],
    true,
  ],
  [
    "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.",
    [
      {
        type: "static",
        text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.",
        effects: [
          {
            type: "scry",
            parameters: {
              lookAt: 2,
              destinations: [
                {
                  zone: "hand",
                  count: 1,
                },
                {
                  zone: "deck",
                  position: "bottom",
                  count: 1,
                },
              ],
            },
          },
        ],
      },
    ],
    true,
  ],
  [
    "Look at the top 3 cards of your deck. Put them back on the top of your deck in any order.",
    [
      {
        type: "static",
        text: "Look at the top 3 cards of your deck. Put them back on the top of your deck in any order.",
        effects: [
          {
            type: "scry",
            parameters: {
              lookAt: 3,
              destinations: [
                {
                  zone: "top",
                  count: 3,
                  order: "any",
                },
              ],
            },
          },
        ],
      },
    ],
    true,
  ],
  [
    "Look at the top 3 cards of your deck. You may reveal a character, item, or location card with cost 6 or less and play it for free. Put the rest on the bottom of your deck in any order.",
    [
      {
        type: "static",
        text: "Look at the top 3 cards of your deck. You may reveal a character, item, or location card with cost 6 or less and play it for free. Put the rest on the bottom of your deck in any order.",
        effects: [
          {
            type: "scry",
            parameters: {
              lookAt: 3,
              destinations: [
                {
                  zone: "play",
                  count: 1,
                  reveal: true,
                  filter: {
                    type: "card",
                    cardType: ["character", "item", "location"],
                    cost: {
                      max: 6,
                    },
                  },
                },
                {
                  zone: "bottom",
                  remainder: true,
                  order: "any",
                },
              ],
            },
          },
        ],
      },
    ],
    true,
  ],
  [
    "Look at the top 4 cards of chosen player's deck. Put one on the top of their deck and the rest on the bottom of their deck in any order.",
    [
      {
        type: "static",
        text: "Look at the top 4 cards of chosen player's deck. Put one on the top of their deck and the rest on the bottom of their deck in any order.",
        targets: [chosenPlayerTarget],
        effects: [
          {
            type: "scry",
            parameters: {
              lookAt: 4,
              destinations: [
                {
                  zone: "deck",
                  position: "top",
                  count: 1,
                },
                {
                  zone: "deck",
                  position: "bottom",
                  remainder: true,
                },
              ],
            },
          },
        ],
      },
    ],
    true,
  ],
  [
    "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    [
      {
        type: "static",
        text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
        effects: [
          {
            type: "scry",
            parameters: {
              lookAt: 4,
              destinations: [
                {
                  zone: "hand",
                  count: 1,
                  reveal: true,
                  filter: {
                    type: "card",
                    cardType: ["character"],
                  },
                },
                {
                  zone: "deck",
                  position: "bottom",
                  remainder: true,
                },
              ],
            },
          },
        ],
      },
    ],
    true,
  ],
  [
    "Look at the top 5 cards of your deck. Put any number of them on the top or the bottom of your deck in any order. Gain 1 lore.",
    [
      {
        type: "static",
        text: "Look at the top 5 cards of your deck. Put any number of them on the top or the bottom of your deck in any order. Gain 1 lore.",
        effects: [
          {
            type: "scry",
            parameters: {
              lookAt: 5,
              destinations: [
                {
                  zone: "deck",
                  position: "top",
                  min: 0,
                  max: 5,
                },
                {
                  zone: "deck",
                  position: "bottom",
                  remainder: true,
                },
              ],
            },
          },
          gainLoreEffect({ targets: [selfPlayerTarget] }),
        ],
      },
    ],
    true,
  ],
  [
    "Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order.",
    [
      {
        type: "static",
        text: "Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order.",
        effects: [
          {
            type: "scry",
            parameters: {
              lookAt: 5,
              destinations: [
                {
                  zone: "hand",
                  count: 1,
                },
                {
                  zone: "deck",
                  remainder: true,
                  position: "bottom",
                },
              ],
            },
          },
        ],
      },
    ],
    true,
  ],
  [
    "Look at the top 5 cards of your deck. You may reveal up to 1 Madrigal character card and up to 1 song card and put them into your hand. Put the rest on the top of your deck in any order.",
    [
      {
        type: "static",
        text: "Look at the top 5 cards of your deck. You may reveal up to 1 Madrigal character card and up to 1 song card and put them into your hand. Put the rest on the top of your deck in any order.",
        effects: [
          {
            type: "scry",
            parameters: {
              lookAt: 5,
              destinations: [
                {
                  zone: "hand",
                  min: 0,
                  max: 1,
                  filter: {
                    type: ["character"],
                    classifications: ["madrigal"],
                  },
                },
                {
                  zone: "hand",
                  min: 0,
                  max: 1,
                  filter: {
                    type: ["song"],
                  },
                },
                {
                  zone: "deck",
                  position: "top",
                  remainder: true,
                  shuffle: false,
                  order: "any",
                },
              ],
            },
          },
        ],
      },
    ],
    true,
  ],
  [
    "Move 1 damage counter from chosen character to chosen opposing character. Draw a card.",
    [
      {
        type: "static",
        text: "Move 1 damage counter from chosen character to chosen opposing character. Draw a card.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Move 1 damage counter from chosen character to chosen opposing character.",
    [
      {
        type: "static",
        text: "Move 1 damage counter from chosen character to chosen opposing character.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Move 1 damage counter from each damaged character you have in play to chosen opposing character. Draw a card for each damage counter moved this way.",
    [
      {
        type: "static",
        text: "Move 1 damage counter from each damaged character you have in play to chosen opposing character. Draw a card for each damage counter moved this way.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Move up to 2 characters of yours to the same location for free.",
    [
      {
        type: "static",
        text: "Move up to 2 characters of yours to the same location for free.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Name a card. Return all character cards with that name from your discard to your hand.",
    [
      {
        type: "static",
        text: "Name a card. Return all character cards with that name from your discard to your hand.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Chosen opposing character can't quest during their next turn. Draw a card.",
    [
      {
        type: "static",
        text: "\nChosen opposing character can't quest during their next turn. Draw a card.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Play a character card with cost 5 or less from your discard for free.",
    [
      {
        type: "static",
        text: "Play a character card with cost 5 or less from your discard for free.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Play a character with cost 4 or less for free. They gain **Rush**. At the end of the turn, banish them. _(They can challenge the turn they're played.)_",
    [
      {
        type: "static",
        text: "Play a character with cost 4 or less for free. They gain **Rush**. At the end of the turn, banish them. _(They can challenge the turn they're played.)_",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Put 1 damage counter on chosen character.",
    [
      {
        type: "static",
        text: "Put 1 damage counter on chosen character.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Put all opposing characters with 2 {S} or less on the bottom of their players' decks in any order.",
    [
      {
        type: "static",
        text: "Put all opposing characters with 2 {S} or less on the bottom of their players' decks in any order.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Put chosen character into their player's inkwell facedown and exerted.",
    [
      {
        type: "static",
        text: "Put chosen character into their player's inkwell facedown and exerted.",
        targets: [chosenCharacterTarget],
        effects: [
          putCardEffect({
            to: "inkwell",
            from: "play",
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Put chosen character of yours into your inkwell facedown and exerted.",
    [
      {
        type: "static",
        text: "Put chosen character of yours into your inkwell facedown and exerted.",
        targets: [chosenCharacterOfYoursTarget],
        effects: [
          putCardEffect({
            to: "inkwell",
            from: "play",
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Put chosen exerted character into their player's inkwell facedown and exerted.",
    [
      {
        type: "static",
        text: "Put chosen exerted character into their player's inkwell facedown and exerted.",
        targets: [chosenExertedCharacterTarget],
        effects: [
          putCardEffect({
            to: "inkwell",
            from: "play",
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Put chosen item or location into its player's inkwell facedown and exerted.",
    [
      {
        type: "static",
        text: "Put chosen item or location into its player's inkwell facedown and exerted.",
        targets: [chosenItemOrLocationTarget],
        effects: [
          putCardEffect({
            to: "inkwell",
            from: "play",
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Put the top card of your deck into your inkwell facedown and exerted.",
    [
      {
        type: "static",
        text: "Put the top card of your deck into your inkwell facedown and exerted.",
        effects: [
          putCardEffect({
            to: "inkwell",
            from: "deck",
            position: "top",
            targets: [
              {
                type: "card",
                zone: "deck",
                count: 1,
              },
            ],
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Put up to 2 cards from your discard into your inkwell, facedown and exerted.",
    [
      {
        type: "static",
        text: "Put up to 2 cards from your discard into your inkwell, facedown and exerted.",
        effects: [
          putCardEffect({
            to: "inkwell",
            from: "discard",
            targets: upToTarget({
              target: {
                type: "card",
                zone: "discard",
                count: 1,
              },
              upTo: 2,
            }),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.",
    [
      {
        type: "static",
        text: "Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Ready all your characters. For the rest of this turn, they take no damage from challenges and can't quest.",
    [
      {
        type: "static",
        text: "Ready all your characters. For the rest of this turn, they take no damage from challenges and can't quest.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Ready all your characters. They can't quest for the rest of this turn.",
    [
      {
        type: "static",
        text: "Ready all your characters. They can't quest for the rest of this turn.",
        targets: [yourCharactersTarget],
        effects: [
          { type: "ready" },
          {
            type: "restrict",
            restriction: "quest",
            duration: FOR_THE_REST_OF_THIS_TURN,
          },
        ],
      },
    ],
    true,
  ],
  [
    "Ready all your characters. They gain Reckless this turn. (They can't quest and must challenge if able.)",
    [
      {
        type: "static",
        text: "Ready all your characters. They gain Reckless this turn. (They can't quest and must challenge if able.)",
        targets: [yourCharactersTarget],
        effects: [
          { type: "ready" },
          gainsAbilityEffect({
            ability: recklessAbility,
            duration: THIS_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Ready chosen character of yours at a location. They can't quest for the rest of this turn. Gain lore equal to that location {L}.",
    [
      {
        type: "static",
        text: "Ready chosen character of yours at a location. They can't quest for the rest of this turn. Gain lore equal to that location {L}.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Ready chosen character of yours. They can't quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.",
    [
      {
        type: "static",
        text: "Ready chosen character of yours. They can't quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Ready chosen character.",
    [
      {
        type: "static",
        text: "Ready chosen character.",
        targets: [chosenCharacterTarget],
        effects: [{ type: "ready" }],
      },
    ],
    true,
  ],
  [
    "Ready chosen character. They can't quest for the rest of this turn.",
    [
      {
        type: "static",
        text: "Ready chosen character. They can't quest for the rest of this turn.",
        targets: [chosenCharacterTarget],
        effects: [
          { type: "ready" },
          {
            type: "restrict",
            restriction: "quest",
            duration: FOR_THE_REST_OF_THIS_TURN,
          },
        ],
      },
    ],
    true,
  ],
  [
    "Ready chosen damaged character of yours. They can't quest for the rest of this turn. Draw a card.",
    [
      {
        type: "static",
        text: "Ready chosen damaged character of yours. They can't quest for the rest of this turn. Draw a card.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Remove up to 1 damage from each of your characters.",
    [
      {
        type: "static",
        text: "Remove up to 1 damage from each of your characters.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Remove up to 2 damage from any number of chosen characters.",
    [
      {
        type: "static",
        text: "Remove up to 2 damage from any number of chosen characters.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Remove up to 2 damage from chosen character.",
    [
      {
        type: "static",
        text: "Remove up to 2 damage from chosen character.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Remove up to 3 damage from chosen character and ready them. They can't quest or challenge for the rest of this turn.",
    [
      {
        type: "static",
        text: "Remove up to 3 damage from chosen character and ready them. They can't quest or challenge for the rest of this turn.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Remove up to 3 damage from chosen character or location. Draw a card.",
    [
      {
        type: "static",
        text: "Remove up to 3 damage from chosen character or location. Draw a card.",
        targets: [chosenCharacterOrLocationTarget],
        effects: [
          removeDamageEffect({
            value: upToValue(3),
          }),
          drawCardEffect({ targets: [selfPlayerTarget] }),
        ],
      },
    ],
    true,
  ],
  [
    "Remove up to 3 damage from chosen character. Draw a card.",
    [
      {
        type: "static",
        text: "Remove up to 3 damage from chosen character. Draw a card.",
        targets: [chosenCharacterTarget],
        effects: [
          removeDamageEffect({
            value: upToValue(3),
          }),
          drawCardEffect({ targets: [selfPlayerTarget] }),
        ],
      },
    ],
    true,
  ],
  [
    "Remove up to 3 damage from chosen character and ready them. They can't quest or challenge for the rest of this turn.",
    [
      {
        type: "static",
        text: "Remove up to 3 damage from chosen character and ready them. They can't quest or challenge for the rest of this turn.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Remove up to 3 damage from chosen character.",
    [
      {
        type: "static",
        text: "Remove up to 3 damage from chosen character.",
        targets: [chosenCharacterTarget],
        effects: [
          removeDamageEffect({
            value: upToValue(3),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Remove up to 3 damage from chosen location.",
    [
      {
        type: "static",
        text: "Remove up to 3 damage from chosen location.",
        targets: [chosenLocationTarget],
        effects: [
          removeDamageEffect({
            value: upToValue(3),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Remove up to 3 damage from each of your characters.",
    [
      {
        type: "static",
        text: "Remove up to 3 damage from each of your characters.",
        targets: [yourCharactersTarget],
        effects: [
          removeDamageEffect({
            value: upToValue(3),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Remove up to 3 damage from one of your locations or characters.",
    [
      {
        type: "static",
        text: "Remove up to 3 damage from one of your locations or characters.",
        targets: [
          {
            type: "card",
            cardType: ["location", "character"],
            owner: "self",
            count: 1,
          },
        ],
        effects: [
          removeDamageEffect({
            value: upToValue(3),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Remove up to 4 damage from chosen character. Draw a card.",
    [
      {
        type: "static",
        text: "Remove up to 4 damage from chosen character. Draw a card.",
        effects: [
          removeDamageEffect({
            targets: [chosenCharacterTarget],
            value: upToValue(4),
          }),
          drawCardEffect({ targets: [selfPlayerTarget] }),
        ],
      },
    ],
    true,
  ],
  [
    "Remove up to 4 damage from chosen character.",
    [
      {
        type: "static",
        text: "Remove up to 4 damage from chosen character.",
        targets: [chosenCharacterTarget],
        effects: [
          removeDamageEffect({
            targets: [chosenCharacterTarget],
            value: upToValue(4),
          }),
        ],
      },
    ],
    true,
  ],

  [
    "Return a character card from your discard to your hand. Then remove up to 2 damage from chosen character.",
    [
      {
        type: "static",
        text: "Return a character card from your discard to your hand. Then remove up to 2 damage from chosen character.",
        effects: [
          returnCardEffect({
            to: "hand",
            from: "discard",
            targets: [chosenCharacterFromDiscardTarget],
          }),
          removeDamageEffect({
            targets: [chosenCharacterTarget],
            value: upToValue(2),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Return a character card from your discard to your hand.",
    [
      {
        type: "static",
        text: "Return a character card from your discard to your hand.",
        targets: [chosenCharacterFromDiscardTarget],
        effects: [
          returnCardEffect({
            to: "hand",
            from: "discard",
          }),
        ],
      },
    ],
    true,
  ],
  [
    "\nReturn a character card with cost 2 or less from your discard to your hand.",
    [
      {
        type: "static",
        text: "\nReturn a character card with cost 2 or less from your discard to your hand.",
        targets: [chosenCharacterWithCost2OrLessFromDiscardTarget],
        effects: [
          returnCardEffect({
            to: "hand",
            from: "discard",
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Return a character or item with cost 2 or less to their player's hand.",
    [
      {
        type: "static",
        text: "Return a character or item with cost 2 or less to their player's hand.",
        targets: [chosenCharacterOrItemWithCost2OrLessTarget],
        effects: [
          returnCardEffect({
            to: "hand",
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Return a character, item or location with cost 2 or less to their player's hand.",
    [
      {
        type: "static",
        text: "Return a character, item or location with cost 2 or less to their player's hand.",
        targets: [chosenCharacterItemOrLocationWithCost2OrLessTarget],
        effects: [
          returnCardEffect({
            to: "hand",
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Return an action card from your discard to your hand.",
    [
      {
        type: "static",
        text: "Return an action card from your discard to your hand.",
        targets: [chosenActionFromDiscardTarget],
        effects: [
          returnCardEffect({
            from: "discard",
            to: "hand",
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Return an item card from your discard to your hand.",
    [
      {
        type: "static",
        text: "Return an item card from your discard to your hand.",
        targets: [chosenItemTarget],
        effects: [
          returnCardEffect({
            from: "discard",
            to: "hand",
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Return chosen character of yours to your hand to play another character with the same cost or less for free.",
    [
      {
        type: "static",
        text: "Return chosen character of yours to your hand to play another character with the same cost or less for free.",
        targets: [chosenCharacterOfYoursTarget],
        effects: [], // TODO: Implement dynamic value relative to target character's cost
      },
    ],
    true,
  ],
  [
    "Return chosen character of yours to your hand to return another chosen character to their player's hand.",
    [
      {
        type: "static",
        text: "Return chosen character of yours to your hand to return another chosen character to their player's hand.",
        effects: [
          returnCardEffect({
            targets: [chosenCharacterOfYoursTarget],
            from: "play",
            to: "hand",
            followedBy: returnCardEffect({
              targets: [chosenCharacterTarget],
              from: "play",
              to: "hand",
            }),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Return chosen character of yours to your hand. Exert chosen character.",
    [
      {
        type: "static",
        text: "Return chosen character of yours to your hand. Exert chosen character.",
        targets: [],
        effects: [
          returnCardEffect({
            targets: [chosenCharacterOfYoursTarget],
            from: "play",
            to: "hand",
            followedBy: exertCardEffect({
              targets: [chosenCharacterTarget],
            }),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Return chosen character to their player's hand, then that player discards a card at random.",
    [
      {
        type: "static",
        text: "Return chosen character to their player's hand, then that player discards a card at random.",
        effects: [
          returnCardEffect({
            targets: [chosenCharacterTarget],
            from: "play",
            to: "hand",
            followedBy: discardCardEffect({
              targets: [targetOwnerTarget],
              random: true,
              value: 1,
            }),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Return chosen character to their player's hand.",
    [
      {
        type: "static",
        text: "Return chosen character to their player's hand.",
        targets: [chosenCharacterTarget],
        effects: [
          returnCardEffect({
            to: "hand",
            from: "play",
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Return chosen character with 2 {S} or less to their player's hand. Return a character card from your discard to your hand.",
    [
      {
        type: "static",
        text: "Return chosen character with 2 {S} or less to their player's hand. Return a character card from your discard to your hand.",
        effects: [
          returnCardEffect({
            targets: [
              chosenCharacterWithTarget({
                attribute: "strength",
                comparison: "lte",
                value: 2,
              }),
            ],
            to: "hand",
            from: "play",
          }),
          returnCardEffect({
            targets: [chosenCharacterFromDiscardTarget],
            to: "hand",
            from: "discard",
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Return chosen damaged character to their player's hand.",
    [
      {
        type: "static",
        text: "Return chosen damaged character to their player's hand.",
        targets: [chosenDamagedCharacterTarget],
        effects: [
          returnCardEffect({
            to: "hand",
            from: "play",
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Return up to 2 item cards from your discard into your hand.",
    [
      {
        type: "static",
        text: "Return up to 2 item cards from your discard into your hand.",
        effects: [
          returnCardEffect({
            to: "hand",
            from: "discard",
            targets: upToTarget({
              target: {
                type: "card",
                cardType: "item",
                zone: "discard",
                count: 1,
              },
              upTo: 2,
            }),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Reveal the top 2 cards of your deck. Put revealed character cards into your hand. Put the rest on the bottom of your deck in any order.",
    [
      {
        type: "static",
        text: "Reveal the top 2 cards of your deck. Put revealed character cards into your hand. Put the rest on the bottom of your deck in any order.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Search your deck for a location card, reveal that card to all players, and put it into your hand. Then, shuffle your deck.",
    [
      {
        type: "static",
        text: "Search your deck for a location card, reveal that card to all players, and put it into your hand. Then, shuffle your deck.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.",
    [
      {
        type: "static",
        text: "Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
    [
      {
        type: "static",
        text: "Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Sing Together 6\nRemove up to 3 damage from any number of chosen characters. All opposing characters get -3 {S} this turn.",
    [
      {
        type: "static",
        text: "Sing Together 6\nRemove up to 3 damage from any number of chosen characters. All opposing characters get -3 {S} this turn.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Sing Together 7\nChoose any number of players. They discard their hands and draw 3 cards each.",
    [
      {
        type: "static",
        text: "Sing Together 7\nChoose any number of players. They discard their hands and draw 3 cards each.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Sing Together 8\nReady all your characters. For the rest of this turn, they take no damage from challenges and can't quest.",
    [
      {
        type: "static",
        text: "Sing Together 8\nReady all your characters. For the rest of this turn, they take no damage from challenges and can't quest.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Sing Together 8\nReturn up to 2 chosen characters with 3 {S} or less each to their player's hand.",
    [
      {
        type: "static",
        text: "Sing Together 8\nReturn up to 2 chosen characters with 3 {S} or less each to their player's hand.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Sing Together 9 (Any number of your or your teammates' characters with total cost 9 or more may {E} to sing this song for free.)\nReturn up to 3 character cards from your discard to your hand. You pay 2 {I} less for the next character you play this turn.",
    [
      {
        type: "static",
        text: "Sing Together 9 (Any number of your or your teammates' characters with total cost 9 or more may {E} to sing this song for free.)\nReturn up to 3 character cards from your discard to your hand. You pay 2 {I} less for the next character you play this turn.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Sing Together 9\nFor each character that sang this song, draw a card and gain 1 lore.",
    [
      {
        type: "static",
        text: "Sing Together 9\nFor each character that sang this song, draw a card and gain 1 lore.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "This turn, you may put an additional card from your hand into your inkwell facedown. Draw a card.",
    [
      {
        type: "static",
        text: "This turn, you may put an additional card from your hand into your inkwell facedown. Draw a card.",
        effects: [
          {
            type: "inkwell",
            parameters: {
              additional: 1,
            },
            duration: THIS_TURN,
            optional: true,
          },
          drawCardEffect({ targets: [selfPlayerTarget] }),
        ],
      },
    ],
    true,
  ],
  [
    "Up to 2 chosen characters can't ready at the start of their next turn. Draw a card.",
    [
      {
        type: "static",
        text: "Up to 2 chosen characters can't ready at the start of their next turn. Draw a card.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Up to 2 chosen characters get -1 {S} this turn. Draw a card.",
    [
      {
        type: "static",
        text: "Up to 2 chosen characters get -1 {S} this turn. Draw a card.",
        effects: [
          getEffect({
            targets: upToTarget({
              target: chosenCharacterTarget,
              upTo: 2,
            }),
            attribute: "strength",
            value: -1,
            duration: THIS_TURN,
          }),
          drawCardEffect({ targets: [selfPlayerTarget] }),
        ],
      },
    ],
    true,
  ],
  [
    "Whenever one of your characters quests this turn, each opponent loses 1 lore.",
    [
      {
        type: "static",
        text: "Whenever one of your characters quests this turn, each opponent loses 1 lore.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Whenever one of your characters quests this turn, gain 1 lore.",
    [
      {
        type: "static",
        text: "Whenever one of your characters quests this turn, gain 1 lore.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "You may play a character with cost 5 or less for free.",
    [
      {
        type: "static",
        text: "You may play a character with cost 5 or less for free.",
        effects: [
          {
            type: "play",
            targets: [
              {
                type: "card",
                zone: "hand",
                cardType: "character",
                filter: {
                  cost: { max: 5 },
                },
                count: 1,
              },
            ],
            parameters: {
              cost: 0,
            },
            optional: true,
          },
        ],
      },
    ],
    true,
  ],
  [
    "Your characters can't be challenged until the start of your next turn.",
    [
      {
        type: "static",
        text: "Your characters can't be challenged until the start of your next turn.",
        targets: [yourCharactersTarget],
        effects: [
          {
            type: "restrict",
            restriction: "challengeable",
            duration: UNTIL_START_OF_YOUR_NEXT_TURN,
          },
        ],
      },
    ],
    true,
  ],
  [
    "Your characters gain **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_",
    [
      {
        type: "static",
        text: "Your characters gain **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_",
        targets: [yourCharactersTarget],
        effects: [
          gainsAbilityEffect({
            ability: resistAbility(2),
            duration: UNTIL_START_OF_YOUR_NEXT_TURN,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Your characters gain Challenger +2 and 'When this character is banished in a challenge, return this card to your hand' this turn.",
    [
      {
        type: "static",
        text: "Your characters gain Challenger +2 and 'When this character is banished in a challenge, return this card to your hand' this turn.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Your characters gain {E}, 1 {I} – Deal 1 damage to chosen character this turn.",
    [
      {
        type: "static",
        text: "Your characters gain {E}, 1 {I} – Deal 1 damage to chosen character this turn.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Your characters get +2 {S} this turn. \nWhenever one of your characters with **Reckless** challenges another character this turn, gain 2 lore.",
    [
      {
        type: "static",
        text: "Your characters get +2 {S} this turn. \nWhenever one of your characters with **Reckless** challenges another character this turn, gain 2 lore.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Your characters get +2 {S} this turn.",
    [
      {
        type: "static",
        text: "Your characters get +2 {S} this turn.",
        targets: [yourCharactersTarget],
        effects: [getEffect({ attribute: "strength", value: 2 })],
      },
    ],
    true,
  ],
  [
    "Your characters get +3 {S} this turn while challenging a location.",
    [
      {
        type: "static",
        text: "Your characters get +3 {S} this turn while challenging a location.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Your Inventor characters gain **Resist** +6 this turn. Then, put this card into your inkwell facedown and exerted. _(Damage dealt to them is reduced by 6.)_",
    [
      {
        type: "static",
        text: "Your Inventor characters gain **Resist** +6 this turn. Then, put this card into your inkwell facedown and exerted. _(Damage dealt to them is reduced by 6.)_",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    'Your Pirate characters gain "{E} – Banish chosen damaged character" this turn.',
    [],
    true,
  ],
  [
    "**Sing Together** 6 _(Any number of your of your teammates' characters with total cost 6 or more may {E} to sing this song for free.)_\n\n\nEach opponent loses 2 lore. You gain 2 lore.",
    [
      singerTogetherAbility(6),
      {
        type: "static",
        text: "Each opponent loses 2 lore. You gain 2 lore.",
        effects: [
          loseLoreEffect({ value: 2, targets: [eachOpponentTarget] }),
          gainLoreEffect({ value: 2, targets: [youPlayerTarget] }),
        ],
      },
    ],
    true,
  ],
  [
    "Look at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
    [
      singerTogetherAbility(7),
      {
        type: "static",
        text: "Look at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
        effects: [
          {
            type: "scry",
            parameters: {
              lookAt: 5,
              destinations: [
                {
                  zone: "hand",
                  min: 0,
                  max: 2,
                  reveal: true,
                  filter: {
                    type: ["character"],
                  },
                },
                {
                  zone: "deck",
                  position: "bottom",
                  remainder: true,
                  order: "any",
                },
              ],
            },
          },
        ],
      },
    ],
    true,
  ],
  [
    "**Sing Together** 8 _(Any number of your of your teammates' characters with total cost 8 or more may {E} to sing this song for free.)_\n\n\nLook at the top 7 cards of your deck. Put 2 into your hand. Put the rest on the bottom of your deck in any order.",
    [
      singerTogetherAbility(8),
      {
        type: "static",
        text: "Look at the top 7 cards of your deck. Put 2 into your hand. Put the rest on the bottom of your deck in any order.",
        effects: [
          {
            type: "scry",
            parameters: {
              lookAt: 7,
              destinations: [
                {
                  zone: "hand",
                  count: 2,
                },
                {
                  zone: "deck",
                  position: "bottom",
                  remainder: true,
                  order: "any",
                },
              ],
            },
          },
        ],
      },
    ],
    true,
  ],
  [
    "**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_\n\n\nChosen player draws 5 cards.",
    [
      singerTogetherAbility(10),
      {
        type: "static",
        text: "Chosen player draws 5 cards.",
        targets: [chosenPlayerTarget],
        effects: [drawCardEffect({ value: 5 })],
      },
    ],
    true,
  ],
  [
    "**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_\n\n\nDeal 3 damage to up to 3 chosen characters and/or locations.",
    [
      singerTogetherAbility(10),
      {
        type: "static",
        text: "Deal 3 damage to up to 3 chosen characters and/or locations.",
        effects: [
          dealDamageEffect({
            value: 3,
            targets: upToTarget({
              target: chosenCharacterOrLocationTarget,
              upTo: 3,
            }),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Return a character card from your discard to your hand.",
    [
      {
        type: "static",
        text: "Return a character card from your discard to your hand.",
        targets: [chosenCharacterFromDiscardTarget],
        effects: [
          returnCardEffect({
            to: "hand",
            from: "discard",
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Return an action card from your discard to your hand.",
    [
      {
        type: "static",
        text: "Return an action card from your discard to your hand.",
        targets: [chosenActionFromDiscardTarget],
        effects: [
          returnCardEffect({
            to: "hand",
            from: "discard",
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Return an item card from your discard to your hand.",
    [
      {
        type: "static",
        text: "Return an item card from your discard to your hand.",
        targets: [chosenItemFromDiscardTarget],
        effects: [
          returnCardEffect({
            to: "hand",
            from: "discard",
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Draw 2 cards, then choose and discard a card.",
    [
      {
        type: "static",
        text: "Draw 2 cards, then choose and discard a card.",
        effects: [drawThenDiscardEffect({ draw: 2, discard: 1 })],
      },
    ],
    true,
  ],
  [
    "Remove up to 2 damage from any number of chosen characters.",
    [
      {
        type: "static",
        text: "Remove up to 2 damage from any number of chosen characters.",
        targets: [anyNumberOfChosenCharacters],
        effects: [
          removeDamageEffect({
            value: upToValue(2),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Remove up to 1 damage from each of your characters.",
    [
      {
        type: "static",
        text: "Remove up to 1 damage from each of your characters.",
        targets: [yourCharactersTarget],
        effects: [
          removeDamageEffect({
            value: upToValue(1),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Remove up to 3 damage from chosen character.",
    [
      {
        type: "static",
        text: "Remove up to 3 damage from chosen character.",
        targets: [chosenCharacterTarget],
        effects: [
          removeDamageEffect({
            value: upToValue(3),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Remove up to 3 damage from each of your characters.",
    [
      {
        type: "static",
        text: "Remove up to 3 damage from each of your characters.",
        targets: [yourCharactersTarget],
        effects: [
          removeDamageEffect({
            value: upToValue(3),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Remove up to 3 damage from one of your locations or characters.",
    [
      {
        type: "static",
        text: "Remove up to 3 damage from one of your locations or characters.",
        targets: [
          {
            type: "card",
            cardType: ["location", "character"],
            owner: "self",
            count: 1,
          },
        ],
        effects: [
          removeDamageEffect({
            value: upToValue(3),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Remove up to 4 damage from chosen character.",
    [
      {
        type: "static",
        text: "Remove up to 4 damage from chosen character.",
        effects: [
          removeDamageEffect({
            targets: chosenCharacterTarget,
            value: 4,
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Remove up to 3 damage from chosen character.",
    [
      {
        type: "static",
        text: "Remove up to 3 damage from chosen character.",
        effects: [
          removeDamageEffect({
            targets: [chosenCharacterTarget],
            value: upToValue(3),
          }),
        ],
      },
    ],
    true,
  ],
  [
    "Remove up to 3 damage from each of your characters with Bodyguard.",
    [
      {
        type: "static",
        text: "Remove up to 3 damage from each of your characters with Bodyguard.",
        effects: [
          removeDamageEffect({
            targets: [allBodyGuardCharactersTarget],
            value: upToValue(3),
          }),
        ],
      },
    ],
    true,
  ],
];

test.each(actionTexts)(
  "AbilityBuilder.fromText(%s)",
  (text: string, expected: LorcanaAbility[], skip?: boolean) => {
    if (skip) {
      return;
    }

    const ability = AbilityBuilder.fromText(text);
    expect(ability).toEqual(expected);
  },
);
