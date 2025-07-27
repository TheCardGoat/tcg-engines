import { expect, test } from "bun:test";
import { UNTIL_START_OF_YOUR_NEXT_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  banishEffect,
  drawCardEffect,
  gainLoreEffect,
  getEffect,
  returnCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  allCharactersTarget,
  allItemsTarget,
  allOpposingCharactersTarget,
  anyNumberOfYourItems,
  chosenCharacterOfYoursTarget,
  chosenCharacterTarget,
  chosenCharacterWhoHasChallengedTarget,
  chosenCharacterWithTarget,
  chosenItemFromDiscardTarget,
  chosenItemTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import {
  selfPlayerTarget,
  targetOwnerTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaAbility } from "../../ability-types";
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
            thenEffect: drawCardEffect({
              amount: { type: "count", previousEffectTargets: true },
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
            thenEffect: banishEffect({ targets: [chosenCharacterTarget] }),
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
            amount: 2,
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
            amount: 5,
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
            thenEffect: banishEffect({
              thenEffect: returnCardEffect({
                to: "hand",
                from: "discard",
                targets: [chosenItemFromDiscardTarget],
              }),
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
            thenEffect: gainLoreEffect({
              targets: [targetOwnerTarget],
              amount: 2,
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Chosen character gains **Challenger** +3 this turn. _(They get +3 {S} while challenging.)_",
    [
      {
        type: "static",
        text: "Chosen character gains **Challenger** +3 this turn. _(They get +3 {S} while challenging.)_",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Chosen character gains **Evasive** until the start of your next turn. _Only characters with Evasive can challenge them.)_",
    [
      {
        type: "static",
        text: "Chosen character gains **Evasive** until the start of your next turn. _Only characters with Evasive can challenge them.)_",
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Chosen character gains **Resist** +1 and **Evasive** this turn. _(Damage dealt to them is reduced by 1. They can challenge characters with Evasive.)_",
    [
      {
        type: "static",
        text: "Chosen character gains **Resist** +1 and **Evasive** this turn. _(Damage dealt to them is reduced by 1. They can challenge characters with Evasive.)_",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Chosen character gains **Resist** +2 until the start of your next turn. If a Hero character is chosen, they may also challenge ready characters this turn. _(Damage dealt to them is reduced by 2.)_",
    [
      {
        type: "static",
        text: "Chosen character gains **Resist** +2 until the start of your next turn. If a Hero character is chosen, they may also challenge ready characters this turn. _(Damage dealt to them is reduced by 2.)_",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
    [
      {
        type: "static",
        text: "Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
    [
      {
        type: "static",
        text: "Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Chosen character gains **Support** this turn. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
    [
      {
        type: "static",
        text: "Chosen character gains **Support** this turn. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Chosen character gains **Support** this turn. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
    [
      {
        type: "static",
        text: "Chosen character gains **Support** this turn. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "Chosen character gains **Ward** and **Evasive** until the start of your next turn. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_",
    [
      {
        type: "static",
        text: "Chosen character gains **Ward** and **Evasive** until the start of your next turn. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_",
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
    "\nChosen opposing character can't quest during their next turn. Draw a card.",
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
    "Ready chosen character. They can't quest for the rest of this turn.",
    [
      {
        type: "static",
        text: "Ready chosen character. They can't quest for the rest of this turn.",
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
    "Remove up to 3 damage from chosen character.",
    [
      {
        type: "static",
        text: "Remove up to 3 damage from chosen character.",
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
        targets: [],
        effects: [],
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
      {
        type: "static",
        text: "**Sing Together** 6 _(Any number of your of your teammates' characters with total cost 6 or more may {E} to sing this song for free.)_\n\n\nEach opponent loses 2 lore. You gain 2 lore.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "**Sing Together** 7 _(Any number of your of your teammates' characters with total cost 7 or more may {E} to sing this song for free.)_\n\n\nLook at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
    [
      {
        type: "static",
        text: "**Sing Together** 7 _(Any number of your of your teammates' characters with total cost 7 or more may {E} to sing this song for free.)_\n\n\nLook at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "**Sing Together** 8 _(Any number of your of your teammates' characters with total cost 8 or more may {E} to sing this song for free.)_\n\n\nLook at the top 7 cards of your deck. Put 2 into your hand. Put the rest on the bottom of your deck in any order.",
    [
      {
        type: "static",
        text: "**Sing Together** 8 _(Any number of your of your teammates' characters with total cost 8 or more may {E} to sing this song for free.)_\n\n\nLook at the top 7 cards of your deck. Put 2 into your hand. Put the rest on the bottom of your deck in any order.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_\n\n\nChosen player draws 5 cards.",
    [
      {
        type: "static",
        text: "**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_\n\n\nChosen player draws 5 cards.",
        targets: [],
        effects: [],
      },
    ],
    true,
  ],
  [
    "**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_\n\n\nDeal 3 damage to up to 3 chosen characters and/or locations.",
    [
      {
        type: "static",
        text: "**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_\n\n\nDeal 3 damage to up to 3 chosen characters and/or locations.",
        targets: [],
        effects: [],
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
