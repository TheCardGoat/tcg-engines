// STUB: Legacy effect module exports
export * from "./effect";
export * from "./player-effect";
export * from "./scry";

// Legacy effect helper stubs
export const exertAndCantReady: any = () => ({});
export const returnThisCardToHand: any = () => ({});
export const lookAtTopCardOfYourDeckAndPutItOnTopOrBottom: any = () => ({});
export const banishChallengingCharacter: any = () => ({});
export const putOneOnTheTopAndTheOtherOnTheBottomOfYourDeck: any = () => ({});
export const chosenCharacterGetLoreThisTurn: any = () => ({});
export const chosenCharacterCantChallengeDuringNextTurn: any = () => ({});
export const readyAndCantQuest: any = () => ({});
export const discardACard: any = () => ({});
export const opponentLoseLore: any = () => ({});
export const youGainLore: any = () => ({});
export const banishChosenCharacter: any = () => ({});
export const putThisCardIntoYourInkwellExerted: any = () => ({});
export const putTopCardOfYourDeckIntoYourInkwellExerted: any = () => ({});
export const youMayDrawThenChooseAndDiscard: any = () => ({});
export const youPayXLessToPlayNextCharThisTurn: any = () => ({});
export const drawACard: any = () => ({});
export const drawXCards: any = () => ({});
export const entersPlayExerted: any = () => ({});
export const returnCharacterFromDiscardToHand: any = () => ({});
export const readyThisCharacter: any = () => ({});
export const atEndOfTurnBanishItself: any = () => ({});
export const reverseChallenge: any = () => ({});
export const mayBanish: any = () => ({});
export const chosenCharacterGainsResist: any = () => ({});
export const opponentCantPlayActions: any = () => ({});
export const challengeReadyCharacters: any = () => ({});
export const discardAllCards: any = () => ({});
export const targetOwnerDrawsXCards: any = () => ({});
export const exertChosenCharacter: any = () => ({});
export const moveDamageAbility: any = () => ({});
export const returnChosenCharacterWithCostLess: any = () => ({});
export const returnChosenOpposingCharacterWithStrength: any = () => ({});
export const revealTopOfDeckPutInHandOrDeck: any = () => ({});
export const shuffleThisCardIntoYourDeck: any = () => ({});
export const readyThisItem: any = () => ({});
export const opponentRevealHand: any = () => ({});
export const discardTwoCards: any = () => ({});
export const healEffect: any = () => ({});
export const readyChosenCharacter: any = () => ({});
export const youPayXLessToPlayNextItemThisTurn: any = () => ({});
export const youPayXLessToPlayNextActionThisTurn: any = () => ({});
export const youPayXLessToPlayNextLocationThisTurn: any = () => ({});
export const exertedCharCantReadyNextTurn: any = () => ({});
export const moveToLocation: any = () => ({});
export const getLoreThisTurn: any = () => ({});
export const otherCharacterGains: any = () => ({});
export const damageRemovalRestrictionEffect: any = () => ({});
export const exertItemCost: any = { type: "exert" };
export const returnCardToHand: any = () => ({});
export const yourOtherCharactersGainStrengthThisTurn: any = () => ({});

// Legacy exports for missing effects (getStrengthThisTurn is exported from ./effect)
export const banishChosenItem: any = () => ({});
export const chosenCharacterGetsStrength: any = () => ({});
export const exertChosenOpposingCharacter: any = () => ({});
export const eachOpponentLosesXLore: any = () => ({});
export const discardYourHand: any = () => ({});
export const chosenOpposingCharacterLoseStrengthUntilNextTurn: any = () => ({});
export const chosenOpposingCharacterGainsRecklessDuringNextTurn: any =
  () => ({});
export const opponentCharactersLoseStrengthUntilNextTurn: any = () => ({});
export const targetCardGainsResist: any = () => ({});
export const chosenCharacterGainsChallenger: any = () => ({});
export const chosenCharacterOfYoursGainsWhenBanishedReturnToHand: any =
  () => ({});

// Additional missing legacy effects
export const untilTheEndOfYourNextTurn: any = () => ({});
export const readyAndCantQuestOrChallenge: any = () => ({});
export const opponentDiscardsARandomCard: any = () => ({});
export const dealDamageToChosenCharacter: any = () => ({});
export const banishChosenItemOrLocation: any = () => ({});
export const chosenOpposingCharacterCantQuestNextTurn: any = () => ({});
export const chosenOpposingCharacterCantReadyNextTurn: any = () => ({});
export const chosenPlayerMillXCards: any = () => ({});
export const drawCardsUntilYouHaveSameNumberOfCardsAsOpponent: any = () => ({});
export const drawCardsUntilYouHaveXCardsInHand: any = () => ({});
export const exertChosenCharacterWithCharacteristics: any = () => ({});
export const exertChosenItem: any = () => ({});
export const getStrengthThisChallenge: any = () => ({});
export const millOpponentXCards: any = () => ({});
export const millOwnXCards: any = () => ({});
export const opponentAsResponderExertOneOfTheirReadyCharacters: any =
  () => ({});
export const opponentDiscardsACard: any = () => ({});
export const opponentDrawXCards: any = () => ({});
export const putAllCardsFromDiscardToInkwellFaceDownAndExerted: any =
  () => ({});
export const putCardFromDiscardToInkwellFaceDownAndExerted: any = () => ({});
export const putTopCardOfOpponentDeckIntoTheirInkwell: any = () => ({});
export const readyChosenCharacterWithCharacteristics: any = () => ({});
export const readyYourOtherCharacters: any = () => ({});
export const returnChosenCharacterToHand: any = () => ({});
export const theyGainEvasive: any = () => ({});
export const theyGainReckless: any = () => ({});
export const theyGainRush: any = () => ({});
export const yourOpponentGainLore: any = () => ({});

// Legacy effect aliases
export const exertAllOpposingCharacters = exertChosenOpposingCharacter;
export const banishChosenOpposingCharacter = banishChosenCharacter;
export const putChosenCardFromYourHandIntoYourInkwellExerted =
  putTopCardOfYourDeckIntoYourInkwellExerted;
export const returnToHand = returnCardToHand;
export const readyAnotherChosenCharacter = readyChosenCharacter;
export const chosenCharacterGainsRecklessDuringNextTurn =
  chosenOpposingCharacterGainsRecklessDuringNextTurn;
export const chosenCharacterGainsRush = chosenCharacterGainsResist;
export const banishThisCharacter = banishChosenCharacter;
export const chosenCharacterGainsSupport = chosenCharacterGainsResist;
export const enterPlaysExerted = entersPlayExerted;
