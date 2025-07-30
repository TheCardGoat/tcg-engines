import type {
  CardEffectTarget,
  PlayerEffectTarget,
  ResolutionAbility,
  TargetFilter,
  TriggeredAbility,
  Zones,
} from "@lorcanito/lorcana-engine";
import type { DynamicAmount } from "@lorcanito/lorcana-engine/abilities/amounts";
import {
  chosenCharacterOfYours,
  chosenOpposingCharacter,
  opposingCharacters,
} from "@lorcanito/lorcana-engine/abilities/target";
import {
  anotherChosenCharacter,
  challengingCharacter,
  chosenCardFromYourHand,
  chosenCharacter,
  chosenCharacterOfYoursIncludingSelf,
  chosenItem,
  chosenItemOrLocation,
  chosenLocationOfYours,
  chosenPlayer,
  opponent,
  self,
  targetTriggerCard,
  thisCard,
  thisCharacter,
  topCardOfOpponentDeck,
  topCardOfYourDeck,
  yourItems,
} from "@lorcanito/lorcana-engine/abilities/targets";
import type { BanishTrigger } from "@lorcanito/lorcana-engine/abilities/triggers";
import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
import type { NumericOperator } from "@lorcanito/lorcana-engine/store/resolvers/filterResolver";
import { atTheEndOfYourTurn } from "../abilities/atTheAbilities";
import type { Characteristics } from "../cards/cardTypes";
import {
  type AbilityEffect,
  type AdditionalInkwell,
  type AttributeEffect,
  type BanishEffect,
  type CardRestrictionEffect,
  CreateLayerTargetingPlayer,
  type DamageEffect,
  type DiscardEffect,
  type DrawEffect,
  type Effect,
  type ExertEffect,
  type HealEffect,
  type LoreEffect,
  type MillEffect,
  type MoveCardEffect,
  type MoveDamageEffect,
  type MoveToLocationEffect,
  type PlayerRestrictionEffect,
  type PutDamageEffect,
  type ReplacementEffect,
  type RevealEffect,
  type RevealTopCardEffect,
  type ScryEffect,
  type ShuffleDeckEffect,
} from "./effectTypes";

export const readyThisCharacter: ExertEffect = {
  type: "exert",
  exert: false,
  target: {
    type: "card",
    value: "all",
    filters: [{ filter: "source", value: "self" }],
  },
};

export const readyYourOtherCharacters: ExertEffect = {
  type: "exert",
  exert: false,
  target: {
    type: "card",
    value: "all",
    excludeSelf: true,
    filters: [
      { filter: "owner", value: "self" },
      { filter: "zone", value: "play" },
      { filter: "type", value: "character" },
    ],
  },
};

export const readyThisItem: ExertEffect = readyThisCharacter;

export const readyChosenCharacter: ExertEffect = {
  type: "exert",
  exert: false,
  target: chosenCharacter,
};

export const readyChosenItem: ExertEffect = {
  type: "exert",
  exert: false,
  target: chosenItem,
};

export const exertChosenItem: ExertEffect = {
  type: "exert",
  exert: true,
  target: chosenItem,
};

export const readyAnotherChosenCharacter: ExertEffect = {
  type: "exert",
  exert: false,
  target: anotherChosenCharacter,
};

export const exertChosenOpposingCharacter: ExertEffect = {
  type: "exert",
  exert: true,
  target: chosenOpposingCharacter,
};

export const exertChosenCharacter: ExertEffect = {
  type: "exert",
  exert: true,
  target: chosenCharacter,
};

export function exertChosenCharacterWithCharacteristics(
  characteristics: Characteristics | Characteristics[],
): ExertEffect {
  const wrappedCharacteristics = [characteristics].flat();
  return {
    type: "exert",
    exert: true,
    target: {
      type: "card",
      value: 1,
      filters: [
        { filter: "zone", value: "play" },
        { filter: "characteristics", value: wrappedCharacteristics },
      ],
    },
  };
}

export function readyChosenCharacterWithCharacteristics(
  characteristics: Characteristics | Characteristics[],
): ExertEffect {
  const wrappedCharacteristics = [characteristics].flat();
  return {
    type: "exert",
    exert: false,
    target: {
      type: "card",
      value: 1,
      filters: [
        { filter: "zone", value: "play" },
        { filter: "characteristics", value: wrappedCharacteristics },
      ],
    },
  };
}

export const opponentDiscardsARandomCard: DiscardEffect = opponentDiscardsACard(
  [],
  true,
);

export function opponentDiscardsACard(
  additionalFilters: TargetFilter[] = [],
  random = false,
): DiscardEffect {
  return {
    type: "discard",
    amount: 1,
    target: {
      type: "card",
      value: 1,
      random: random,
      filters: [
        { filter: "zone", value: "hand" },
        { filter: "owner", value: "opponent" },
        ...additionalFilters,
      ],
    },
  };
}

export const moveOpponentCharacterToHand: MoveCardEffect = {
  type: "move",
  to: "hand",
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "zone", value: "play" },
      { filter: "type", value: ["character"] },
      { filter: "owner", value: "opponent" },
    ],
  },
};

export const putCardFromYourHandOnTheTopOfYourDeck: MoveCardEffect = {
  type: "move",
  to: "deck",
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "zone", value: "hand" },
      { filter: "owner", value: "self" },
    ],
  },
};

export const drawACard: DrawEffect = {
  type: "draw",
  amount: 1,
  target: {
    type: "player",
    value: "self",
  },
};

export const targetOwnerDrawsXCards = (amount: number): DrawEffect => ({
  type: "draw",
  amount,
  target: {
    type: "player",
    value: "target_owner",
  },
});

export const youMayPutAnAdditionalCardFromYourHandIntoYourInkwell: AdditionalInkwell =
  {
    type: "additional-inkwell",
    amount: 1,
    duration: "turn",
    target: self,
  };

export const opponentDrawXCards = (
  amount: number | DynamicAmount,
): DrawEffect => ({
  type: "draw",
  amount,
  target: {
    type: "player",
    value: "opponent",
  },
});

export const drawCardsUntilYouHaveSameNumberOfCardsAsOpponent: DrawEffect = {
  type: "draw",
  amount: {
    dynamic: true,
    filters: [
      { filter: "owner", value: "opponent" },
      { filter: "zone", value: "hand" },
    ],
    difference: [
      { filter: "owner", value: "self" },
      { filter: "zone", value: "hand" },
    ],
  },
  target: {
    type: "player",
    value: "self",
  },
};

export const drawCardsUntilYouHaveXCardsInHand = (
  value: number,
): DrawEffect => ({
  type: "draw",
  amount: {
    dynamic: true,
    filters: [
      { filter: "owner", value: "self" },
      { filter: "zone", value: "hand" },
    ],
    difference: value,
  },
  target: {
    type: "player",
    value: "self",
  },
});

export const discardTwoCards: DiscardEffect = {
  type: "discard",
  amount: 2,
  target: {
    type: "card",
    value: 2,
    filters: [
      { filter: "owner", value: "self" },
      { filter: "zone", value: "hand" },
    ],
  },
};

export const discardACard: DiscardEffect = {
  type: "discard",
  amount: 1,
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "owner", value: "self" },
      { filter: "zone", value: "hand" },
    ],
  },
};

export const discardAllCardsInOpponentsHand: DiscardEffect = {
  type: "discard",
  amount: 60,
  target: {
    type: "card",
    value: "all",
    filters: [
      { filter: "owner", value: "opponent" },
      { filter: "zone", value: "hand" },
    ],
  },
};

export const discardAllCards: DiscardEffect = {
  type: "discard",
  amount: 99,
  target: {
    type: "card",
    value: "all",
    filters: [
      { filter: "owner", value: "self" },
      { filter: "zone", value: "hand" },
    ],
  },
};

export const discardYourHand: DiscardEffect = {
  type: "discard",
  amount: 1,
  target: {
    type: "card",
    value: "all",
    filters: [
      { filter: "owner", value: "self" },
      { filter: "zone", value: "hand" },
    ],
  },
};

export function targetCardGainsResist({
  target,
  amount,
  duration,
}: {
  target: CardEffectTarget;
  duration: "turn" | "next_turn";
  amount: number;
}): AbilityEffect {
  return {
    type: "ability",
    ability: "resist",
    amount: amount,
    modifier: "add",
    until: true,
    duration: duration,
    target: target,
  };
}

// If it doesn't work, look at the titan card
export function chosenCharacterGainsResist(
  amount: number,
  duration: "turn" | "next_turn" = "next_turn",
): AbilityEffect {
  return {
    type: "ability",
    ability: "resist",
    amount,
    modifier: "add",
    duration: duration,
    until: true,
    target: chosenCharacter,
  };
}

export const choseCharacterGainsReckless: AbilityEffect = {
  type: "ability",
  ability: "reckless",
  duration: "turn",
  modifier: "add",
  target: chosenCharacter,
};

export const theyGainReckless: AbilityEffect = {
  type: "ability",
  ability: "reckless",
  duration: "turn",
  modifier: "add",
  target: targetTriggerCard,
};

export const chosenCharacterGainsRecklessDuringNextTurn: AbilityEffect = {
  type: "ability",
  ability: "reckless",
  duration: "next_turn",
  modifier: "add",
  target: chosenCharacter,
};

export const chosenOpposingCharacterGainsRecklessDuringNextTurn: AbilityEffect =
  {
    type: "ability",
    ability: "reckless",
    duration: "next_turn",
    modifier: "add",
    target: chosenOpposingCharacter,
  };

export const chosenCharacterGainsRush: AbilityEffect = {
  type: "ability",
  ability: "rush",
  duration: "turn",
  modifier: "add",
  target: chosenCharacter,
};

export const theyGainRush: AbilityEffect = {
  type: "ability",
  ability: "rush",
  duration: "turn",
  modifier: "add",
  target: targetTriggerCard,
};

export const chosenCharacterGainsSupport = (
  duration: "turn" | "next_turn" | "static" | "challenge" | "next" | undefined,
): AbilityEffect => {
  return {
    type: "ability",
    ability: "support",
    modifier: "add",
    duration: duration,
    until: true,
    target: chosenCharacter,
  };
};

export const chosenCharacterGainsBodyguard: AbilityEffect = {
  type: "ability",
  ability: "bodyguard",
  modifier: "add",
  duration: "turn",
  target: chosenCharacter,
};

export const chosenOpposingCharacterCantQuestNextTurn: CardRestrictionEffect = {
  type: "restriction",
  restriction: "quest",
  duration: "next_turn",
  until: true,
  target: chosenOpposingCharacter,
};

export const chosenOpposingCharacterCantReadyNextTurn: CardRestrictionEffect = {
  type: "restriction",
  restriction: "ready-at-start-of-turn",
  duration: "next_turn",
  until: true,
  target: chosenOpposingCharacter,
};

export const chosenCharacterGainsEvasive: AbilityEffect = {
  type: "ability",
  ability: "evasive",
  duration: "turn",
  modifier: "add",
  target: chosenCharacter,
};

export const theyGainEvasive: AbilityEffect = {
  type: "ability",
  ability: "evasive",
  duration: "turn",
  modifier: "add",
  target: targetTriggerCard,
};

export const thisCharacterGainsEvasive: AbilityEffect = {
  type: "ability",
  ability: "evasive",
  duration: "static",
  modifier: "add",
  target: thisCard,
};

export const chosenCharacterGainsChallenger = (
  amount: number,
): AbilityEffect => {
  return {
    type: "ability",
    ability: "challenger",
    amount,
    duration: "turn",
    modifier: "add",
    target: chosenCharacter,
  };
};

export const chosenCharacterGainsWard: AbilityEffect = {
  type: "ability",
  ability: "ward",
  duration: "turn",
  modifier: "add",
  target: chosenCharacter,
};

export function putDamageEffect(
  amount: number | DynamicAmount,
  target: CardEffectTarget,
): PutDamageEffect {
  return {
    type: "put-damage",
    amount: amount,
    target: target,
  };
}

export function dealDamageEffect(
  amount: number | DynamicAmount,
  target: CardEffectTarget,
): DamageEffect {
  return {
    type: "damage",
    amount: amount,
    target: target,
  };
}

export function healEffect(
  amount: number | DynamicAmount,
  target: CardEffectTarget,
  subEffect?: Effect,
): HealEffect {
  return {
    type: "heal",
    amount: amount,
    target: target,
    subEffect: subEffect,
  };
}

export function removeDamageEffect(
  amount: number | DynamicAmount,
  target: CardEffectTarget,
): HealEffect {
  return healEffect(amount, target);
}

export function dealDamageToChosenCharacter(amount: number): DamageEffect {
  return {
    type: "damage",
    amount: amount,
    target: chosenCharacter,
  };
}

export const dealDamageToChosenOpposingCharacter = (amount: number) => {
  return {
    type: "damage",
    amount,
    target: chosenOpposingCharacter,
  };
};

export function drawXCards(
  amount: number | DynamicAmount,
  target: PlayerEffectTarget = self,
): DrawEffect {
  return {
    type: "draw",
    amount: amount,
    target,
  };
}

export function yourOtherCharactersGainStrengthThisTurn(
  amount: number,
): AttributeEffect {
  return {
    type: "attribute",
    attribute: "strength",
    amount: amount,
    modifier: "add",
    duration: "turn",
    target: {
      type: "card",
      value: "all",
      excludeSelf: true,
      filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "self" },
      ],
    },
  };
}

export function chosenOpposingCharacterLoseStrengthUntilNextTurn(
  amount: number,
): AttributeEffect {
  return {
    type: "attribute",
    attribute: "strength",
    amount: amount,
    modifier: "subtract",
    duration: "next_turn",
    until: true,
    target: chosenOpposingCharacter,
  };
}

export function opponentCharactersLoseStrengthUntilNextTurn(
  amount: number,
): AttributeEffect {
  return {
    type: "attribute",
    attribute: "strength",
    amount: amount,
    modifier: "subtract",
    duration: "next_turn",
    until: true,
    target: {
      type: "card",
      value: "all",
      filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "opponent" },
      ],
    },
  };
}

export function opponentCharactersLoseStrengthThisTurn(
  amount: number,
): AttributeEffect {
  return {
    type: "attribute",
    attribute: "strength",
    amount: amount,
    modifier: "subtract",
    duration: "turn",
    until: true,
    target: {
      type: "card",
      value: "all",
      filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "opponent" },
      ],
    },
  };
}

export function mayBanish(target: CardEffectTarget): BanishEffect {
  return {
    type: "banish",
    target,
  };
}

export const banishChosenCharacter: BanishEffect = mayBanish(chosenCharacter);

export const banishYourItem: BanishEffect = mayBanish(yourItems);

export const banishChosenCharacterOfYours: BanishEffect = mayBanish(
  chosenCharacterOfYours,
);
export const banishChosenOpposingCharacter: BanishEffect = mayBanish(
  chosenOpposingCharacter,
);
export const banishChosenItem: BanishEffect = mayBanish(chosenItem);
export const banishChosenItemOrLocation: BanishEffect =
  mayBanish(chosenItemOrLocation);
export const banishChallengingCharacter: BanishEffect =
  mayBanish(challengingCharacter);
export const banishThisCharacter: BanishEffect = mayBanish(thisCharacter);

export function returnCardToHand(target: CardEffectTarget): MoveCardEffect {
  return {
    type: "move",
    to: "hand",
    target: target,
  };
}

export const returnThisCardToHand: MoveCardEffect =
  returnCardToHand(thisCharacter);

export const putTargetCardIntoTheirInkwell = ({
  target,
  exerted = false,
}: {
  target: CardEffectTarget;
  exerted?: boolean;
}): MoveCardEffect => {
  return {
    type: "move",
    to: "inkwell",
    exerted,
    target,
  };
};

export const putThisCardIntoYourInkwellExerted: MoveCardEffect = {
  type: "move",
  to: "inkwell",
  exerted: true,
  target: thisCard,
};

export const putChosenCardFromYourHandIntoYourInkwellExerted: MoveCardEffect = {
  type: "move",
  to: "inkwell",
  exerted: true,
  target: chosenCardFromYourHand,
  isPrivate: true,
};

export const putTopCardOfYourDeckIntoYourInkwellExerted: MoveCardEffect = {
  type: "move",
  to: "inkwell",
  exerted: true,
  target: topCardOfYourDeck,
};

export const putTopCardOfOpponentDeckIntoTheirInkwell: MoveCardEffect = {
  type: "move",
  to: "inkwell",
  target: topCardOfOpponentDeck,
};

export const shuffleThisCardIntoYourDeck: [MoveCardEffect, ShuffleDeckEffect] =
  [
    {
      type: "move",
      to: "deck",
      target: thisCharacter,
    },
    {
      type: "shuffle-deck",
      target: self,
    },
  ];

export function yourOpponentGainLore(
  amount: number | DynamicAmount,
): LoreEffect {
  return {
    type: "lore",
    modifier: "add",
    amount: amount,
    target: opponent,
  };
}

export function youGainLore(amount: number | DynamicAmount): LoreEffect {
  return {
    type: "lore",
    modifier: "add",
    amount: amount,
    target: self,
  };
}

export function opponentLoseLore(amount: number | DynamicAmount): LoreEffect {
  return {
    type: "lore",
    modifier: "subtract",
    amount: amount,
    target: opponent,
  };
}

export const eachOpponentLosesLore = opponentLoseLore;

export function eachOpponentLosesXLore(
  amount: number | DynamicAmount,
): LoreEffect {
  return {
    type: "lore",
    modifier: "subtract",
    amount: amount,
    target: opponent,
  };
}

export function getStrengthThisTurn(
  amount: number | DynamicAmount,
  target: CardEffectTarget,
): AttributeEffect {
  return {
    type: "attribute",
    attribute: "strength",
    amount: amount,
    modifier: "add",
    duration: "turn",
    target: target,
  };
}

export function getLoreThisTurn(
  amount: number,
  target: CardEffectTarget,
): AttributeEffect {
  return {
    type: "attribute",
    attribute: "lore",
    amount: amount,
    modifier: "add",
    duration: "turn",
    target: target,
  };
}

export function chosenCharacterGetLoreThisTurn(
  amount: number,
): AttributeEffect {
  return getLoreThisTurn(amount, chosenCharacter);
}

export function thisCharacterGetsLore(amount: number): AttributeEffect {
  return {
    type: "attribute",
    attribute: "lore",
    amount: amount,
    modifier: "add",
    duration: "turn",
    target: thisCharacter,
  };
}

export function revealTopOfDeckPutInHandOrDeck({
  tutorFilters,
  mode,
  onTargetMatchEffects,
  target,
}: {
  tutorFilters: TargetFilter[];
  mode: "top" | "bottom";
  onTargetMatchEffects?: Effect[];
  target?: CardEffectTarget;
}): [RevealTopCardEffect, ScryEffect] {
  return [
    {
      type: "reveal-top-card",
      target: {
        type: "card",
        value: 1,
        filters: tutorFilters,
      },
      onTargetMatchEffects: onTargetMatchEffects || [],
    },
    {
      type: "scry",
      amount: 1,
      mode,
      tutorFilters,
      shouldRevealTutored: true,
      limits: { [mode]: 1, hand: 1 },
      target: self,
    },
  ];
}

// @ts-ignore same as above
export const putOneOnTheTopAndTheOtherOnTheBottomOfYourDeck: ScryEffect = {
  type: "scry",
  amount: 2,
  mode: "both",
  limits: {
    top: 1,
    inkwell: 0,
    bottom: 1,
    hand: 0,
  },
};

export function youPayXLessToPlayNextCardThisTurn(
  amount: number | DynamicAmount,
  filters: TargetFilter[],
): ReplacementEffect {
  return {
    type: "replacement",
    replacement: "cost",
    duration: "next",
    amount,
    target: {
      type: "card",
      value: "all",
      filters,
    },
  };
}

export function youPayXLessToPlayNextCharThisTurn(
  amount: number | DynamicAmount,
  additionalFilters: TargetFilter[] = [],
): ReplacementEffect {
  const filters: TargetFilter[] = [
    { filter: "type", value: "character" },
    { filter: "owner", value: "self" },
  ];

  if (additionalFilters.length > 0) {
    filters.push(...additionalFilters);
  }

  return youPayXLessToPlayNextCardThisTurn(amount, filters);
}

export function youPayXLessToPlayNextItemThisTurn(
  amount: number | DynamicAmount,
): ReplacementEffect {
  return youPayXLessToPlayNextCardThisTurn(amount, [
    { filter: "type", value: "item" },
  ]);
}

export function youPayXLessToPlayNextLocationThisTurn(
  amount: number | DynamicAmount,
): ReplacementEffect {
  return youPayXLessToPlayNextCardThisTurn(amount, [
    { filter: "type", value: "location" },
  ]);
}

export function youPayXLessToPlayNextActionThisTurn(
  amount: number | DynamicAmount,
): ReplacementEffect {
  return youPayXLessToPlayNextCardThisTurn(amount, [
    { filter: "type", value: "action" },
  ]);
}

export const opponentCantPlayActions: PlayerRestrictionEffect = {
  type: "player-restriction",
  restriction: "play-action-cards",
  target: opponent,
};

export function untilTheEndOfYourNextTurn<
  T extends AttributeEffect | AbilityEffect | PlayerRestrictionEffect,
>(effect: T): T {
  return { ...effect, modifier: "add", duration: "next_turn", until: true };
}

export function entersPlayExerted(params: { name: string }): ResolutionAbility {
  return {
    type: "resolution",
    name: params.name,
    text: "This card enters play exerted.",
    effects: [
      {
        type: "exert",
        exert: true,
        target: {
          type: "card",
          value: "all",
          filters: [{ filter: "source", value: "self" }],
        },
      },
    ],
  };
}

export const chosenCharacterOfYoursGainsChallengerX = (
  amount: number,
): AbilityEffect => ({
  type: "ability",
  ability: "challenger",
  amount,
  modifier: "add",
  duration: "turn",
  target: chosenCharacterOfYours,
});

export const gainsAbilityEffect = ({
  ability,
  target = chosenCharacter,
  duration = "turn",
  until,
}: {
  ability: AbilityEffect["customAbility"];
  target: AbilityEffect["target"];
  duration?: AbilityEffect["duration"];
  until?: AbilityEffect["until"];
}): AbilityEffect => {
  return {
    type: "ability",
    ability: "custom",
    modifier: "add",
    duration: duration,
    until,
    customAbility: ability,
    target: target,
  };
};

export const chosenCharacterOfYoursGainsWhenBanishedReturnToHand: AbilityEffect =
  {
    type: "ability",
    ability: "custom",
    modifier: "add",
    duration: "turn",
    customAbility: {
      type: "static-triggered",
      trigger: {
        on: "banish",
        in: "challenge",
        as: "both",
        filters: [{ filter: "source", value: "self" }],
      } as BanishTrigger,
      layer: {
        type: "resolution",
        effects: [
          {
            type: "move",
            to: "hand",
            target: {
              type: "card",
              value: "all",
              filters: [{ filter: "source", value: "self" }],
            },
          },
        ],
      },
    },
    target: chosenCharacterOfYours,
  };

export const chosenCharacterCantChallengeDuringNextTurn: CardRestrictionEffect =
  {
    type: "restriction",
    restriction: "challenge",
    duration: "next_turn",
    target: chosenCharacter,
  };

export const exertAllOpposingCharacters: ExertEffect = {
  type: "exert",
  exert: true,
  target: opposingCharacters,
};

export const opponentAsResponderExertOneOfTheirReadyCharacters: ExertEffect = {
  type: "exert",
  exert: true,
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "zone", value: "play" },
      { filter: "status", value: "ready" },
      { filter: "owner", value: "self" },
      { filter: "type", value: "character" },
    ],
  },
};

export const returnCharacterFromDiscardToHand: MoveCardEffect = {
  type: "move",
  to: "hand",
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "type", value: "character" },
      { filter: "zone", value: "discard" },
      { filter: "owner", value: "self" },
    ],
  },
};

export function putCardFromDiscardToInkwellFaceDownAndExerted({
  filters,
}: {
  filters: TargetFilter[];
}): MoveCardEffect {
  return moveCardFromXToInkwellFaceDownAndExerted({
    filters,
    isPrivate: false,
    zone: "discard",
  });
}

export function putAllCardsFromDiscardToInkwellFaceDownAndExerted({
  filters,
}: {
  filters: TargetFilter[];
}): MoveCardEffect {
  return moveCardFromXToInkwellFaceDownAndExerted({
    filters,
    isPrivate: false,
    zone: "discard",
    amount: "all",
  });
}

export function moveCardFromXToInkwellFaceDownAndExerted({
  filters,
  zone,
  isPrivate,
  amount = 1,
}: {
  filters: TargetFilter[];
  zone: Zones;
  isPrivate?: boolean;
  amount?: DynamicAmount | number | "all";
}): MoveCardEffect {
  return {
    type: "move",
    to: "inkwell",
    exerted: true,
    isPrivate,
    target: {
      type: "card",
      value: amount,
      filters: [{ filter: "zone", value: zone }, ...filters],
    },
  };
}

export function returnToHand({
  filters,
  excludeSelf = false,
}: {
  filters: TargetFilter[];
  excludeSelf?: boolean;
}): MoveCardEffect {
  return {
    type: "move",
    to: "hand",
    target: {
      type: "card",
      value: 1,
      excludeSelf,
      filters: [{ filter: "zone", value: "discard" }, ...filters],
    },
  };
}

export const returnLocationFromDiscardToHand: MoveCardEffect = {
  type: "move",
  to: "hand",
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "type", value: "location" },
      { filter: "zone", value: "discard" },
      { filter: "owner", value: "self" },
    ],
  },
};

export const exertedItemCantReadyNextTurn: CardRestrictionEffect = {
  type: "restriction",
  restriction: "ready-at-start-of-turn",
  duration: "next_turn",
  target: chosenItem,
};

export const exertedCharCantReadyNextTurn: CardRestrictionEffect = {
  type: "restriction",
  restriction: "ready-at-start-of-turn",
  duration: "next_turn",
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "status", value: "exerted" },
      { filter: "type", value: "character" },
      { filter: "zone", value: "play" },
    ],
  },
};

export const exertedSelfCharCantReadyNextTurn: CardRestrictionEffect = {
  type: "restriction",
  restriction: "ready-at-start-of-turn",
  duration: "next_turn",
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "owner", value: "self" },
      { filter: "status", value: "exerted" },
      { filter: "type", value: "character" },
      { filter: "zone", value: "play" },
    ],
  },
};

export function returnChosenCharacterToHand(): MoveCardEffect {
  return {
    type: "move",
    to: "hand",
    target: {
      type: "card",
      value: 1,
      filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
      ],
    },
  };
}

export function returnChosenCharacterWithCostLess(
  cost: number,
): MoveCardEffect {
  return {
    type: "move",
    to: "hand",
    target: {
      type: "card",
      value: 1,
      filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        {
          filter: "attribute",
          value: "cost",
          comparison: { operator: "lte", value: cost },
          ignoreBonuses: true,
        },
      ],
    },
  };
}

export function returnChosenCharacterWithStrength(
  strength: number,
  operator: NumericOperator,
): MoveCardEffect {
  return {
    type: "move",
    to: "hand",
    target: {
      type: "card",
      value: 1,
      filters: [
        { filter: "zone", value: "play" },
        { filter: "type", value: "character" },
        {
          filter: "attribute",
          value: "strength",
          comparison: { operator: operator, value: strength },
        },
      ],
    },
  };
}

export function returnChosenOpposingCharacterWithStrength(
  strength: number,
  operator: NumericOperator,
): MoveCardEffect {
  return {
    type: "move",
    to: "hand",
    target: {
      type: "card",
      value: 1,
      filters: [
        { filter: "zone", value: "play" },
        { filter: "type", value: "character" },
        { filter: "owner", value: "opponent" },
        {
          filter: "attribute",
          value: "strength",
          comparison: { operator: operator, value: strength },
        },
      ],
    },
  };
}

export const exertAndCantReady = (
  target: CardEffectTarget,
): [ExertEffect, CardRestrictionEffect] => {
  return [
    {
      type: "exert",
      exert: true,
      target,
    },
    {
      type: "restriction",
      restriction: "ready-at-start-of-turn",
      duration: "next_turn",
      until: true,
      target,
    },
  ];
};

export function moveDamageEffect({
  amount,
  from,
  to,
  conditions,
  upTo,
}: {
  amount: number | DynamicAmount;
  from: CardEffectTarget;
  to: CardEffectTarget;
  conditions?: Condition[];
  upTo?: boolean;
}): MoveDamageEffect {
  return { type: "move-damage", amount, target: from, to, conditions };
}

export const opponentDrawsACard: DrawEffect = {
  type: "draw",
  amount: 1,
  target: {
    type: "player",
    value: "opponent",
  },
};
export const youMayDrawThenChooseAndDiscard: ResolutionAbility = {
  type: "resolution",
  optional: true,
  resolveEffectsIndividually: true,
  effects: [discardACard, drawACard],
};

export const readyAndCantQuest = (
  target: CardEffectTarget[],
  nonAccumulative = false,
): [ExertEffect, CardRestrictionEffect] => {
  return [
    {
      type: "exert",
      exert: false,
      target,
    },
    {
      type: "restriction",
      restriction: "quest",
      duration: "turn",
      target,
      nonAccumulative,
    },
  ];
};

export const readyAndCantQuestOrChallenge = (
  target: CardEffectTarget,
): [ExertEffect, CardRestrictionEffect, CardRestrictionEffect] => {
  return [
    {
      type: "exert",
      exert: false,
      target,
    },
    {
      type: "restriction",
      restriction: "quest",
      duration: "turn",
      target,
    },
    {
      type: "restriction",
      restriction: "challenge",
      duration: "turn",
      target,
    },
  ];
};

export const opponentRevealHand: RevealEffect = {
  type: "reveal",
  target: {
    type: "card",
    value: "all",
    filters: [
      { filter: "zone", value: "hand" },
      { filter: "owner", value: "opponent" },
    ],
  },
};

export const damageCharacterOfYours: TargetFilter[] = [
  { filter: "type", value: "character" },
  { filter: "zone", value: "play" },
  { filter: "owner", value: "self" },
  {
    filter: "status",
    value: "damage",
    comparison: { operator: "gte", value: 1 },
  },
];

export const damagedOpposingCharacter: TargetFilter[] = [
  { filter: "type", value: "character" },
  { filter: "zone", value: "play" },
  { filter: "owner", value: "opponent" },
  {
    filter: "status",
    value: "damage",
    comparison: { operator: "gte", value: 1 },
  },
];

export function millOwnXCards(amount: number): MoveCardEffect[] {
  return Array.from({ length: amount }, () => ({
    type: "move",
    to: "discard",
    target: topCardOfYourDeck,
  }));
}

export function millOpponentXCards(amount: number): MoveCardEffect[] {
  return Array.from({ length: amount }, () => ({
    type: "move",
    to: "discard",
    target: topCardOfOpponentDeck,
  }));
}

export function chosenPlayerMillXCards({
  amount,
}: {
  amount: number;
  name?: string;
  text?: string;
}): MillEffect {
  return {
    type: "mill",
    target: chosenPlayer,
    amount,
  };
}

export const enterPlaysExerted: ExertEffect = {
  type: "exert",
  exert: true,
  target: thisCard,
};

export const lookAtTopCardOfYourDeckAndPutItOnTopOrBottom: ScryEffect = {
  type: "scry",
  amount: 1,
  mode: "both",
  target: self,
  limits: {
    bottom: 1,
    inkwell: 0,
    hand: 0,
    top: 1,
  },
};

export function moveToLocation(target: CardEffectTarget): MoveToLocationEffect {
  return {
    type: "move-to-location",
    target: target,
    to: chosenLocationOfYours,
  };
}

export function thisCharacterGetsStrength(
  amount: number | DynamicAmount,
): AttributeEffect {
  return {
    type: "attribute",
    attribute: "strength",
    amount,
    modifier: "add",
    target: thisCharacter,
    duration: "turn",
  };
}

export function chosenCharacterGetsStrength(
  amount: number,
  duration:
    | "turn"
    | "next_turn"
    | "static"
    | "next"
    | "challenge"
    | undefined = "turn",
): AttributeEffect {
  return {
    type: "attribute",
    attribute: "strength",
    amount: Math.abs(amount),
    modifier: amount >= 0 ? "add" : "subtract",
    target: chosenCharacter,
    duration: duration,
    until: true,
  };
}

export function revealTopOfDeckPutInPlayOrDeck({
  tutorFilters,
  playFilters,
  mode,
}: {
  tutorFilters: TargetFilter[];
  playFilters?: TargetFilter[];
  mode: "top" | "bottom";
}): [ScryEffect, RevealTopCardEffect] {
  return [
    {
      type: "scry",
      amount: 1,
      mode,
      tutorFilters,
      playFilters,
      shouldRevealTutored: true,
      limits: { [mode]: 1, play: 1 },
      target: self,
    },
    {
      type: "reveal-top-card",
      target: topCardOfYourDeck,
      onTargetMatchEffects: [],
    },
  ];
}

export const damageRemovalRestrictionEffect: CardRestrictionEffect = {
  type: "restriction",
  restriction: "damage-removal",
  target: thisCharacter,
};

export const damageDealtRestrictionEffect: CardRestrictionEffect = {
  type: "restriction",
  restriction: "damage-dealt",
  target: thisCharacter,
};

export function getStrengthThisChallenge(
  amount: number | DynamicAmount,
  target: CardEffectTarget,
): AttributeEffect {
  return {
    type: "attribute",
    attribute: "strength",
    amount: amount,
    modifier: "add",
    duration: "challenge",
    target: target,
  };
}
