import { chosenCharacterOfYours, chosenOpposingCharacter, opposingCharacters, } from "@lorcanito/lorcana-engine/abilities/target";
import { anotherChosenCharacter, challengingCharacter, chosenCardFromYourHand, chosenCharacter, chosenItem, chosenItemOrLocation, chosenLocationOfYours, chosenPlayer, opponent, self, targetTriggerCard, thisCard, thisCharacter, topCardOfOpponentDeck, topCardOfYourDeck, yourItems, } from "@lorcanito/lorcana-engine/abilities/targets";
export const readyThisCharacter = {
    type: "exert",
    exert: false,
    target: {
        type: "card",
        value: "all",
        filters: [{ filter: "source", value: "self" }],
    },
};
export const readyYourOtherCharacters = {
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
export const readyThisItem = readyThisCharacter;
export const readyChosenCharacter = {
    type: "exert",
    exert: false,
    target: chosenCharacter,
};
export const readyChosenItem = {
    type: "exert",
    exert: false,
    target: chosenItem,
};
export const exertChosenItem = {
    type: "exert",
    exert: true,
    target: chosenItem,
};
export const readyAnotherChosenCharacter = {
    type: "exert",
    exert: false,
    target: anotherChosenCharacter,
};
export const exertChosenOpposingCharacter = {
    type: "exert",
    exert: true,
    target: chosenOpposingCharacter,
};
export const exertChosenCharacter = {
    type: "exert",
    exert: true,
    target: chosenCharacter,
};
export function exertChosenCharacterWithCharacteristics(characteristics) {
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
export function readyChosenCharacterWithCharacteristics(characteristics) {
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
export const opponentDiscardsARandomCard = opponentDiscardsACard([], true);
export function opponentDiscardsACard(additionalFilters = [], random = false) {
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
export const moveOpponentCharacterToHand = {
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
export const putCardFromYourHandOnTheTopOfYourDeck = {
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
export const drawACard = {
    type: "draw",
    amount: 1,
    target: {
        type: "player",
        value: "self",
    },
};
export const targetOwnerDrawsXCards = (amount) => ({
    type: "draw",
    amount,
    target: {
        type: "player",
        value: "target_owner",
    },
});
export const youMayPutAnAdditionalCardFromYourHandIntoYourInkwell = {
    type: "additional-inkwell",
    amount: 1,
    duration: "turn",
    target: self,
};
export const opponentDrawXCards = (amount) => ({
    type: "draw",
    amount,
    target: {
        type: "player",
        value: "opponent",
    },
});
export const drawCardsUntilYouHaveSameNumberOfCardsAsOpponent = {
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
export const drawCardsUntilYouHaveXCardsInHand = (value) => ({
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
export const discardTwoCards = {
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
export const discardACard = {
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
export const discardAllCardsInOpponentsHand = {
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
export const discardAllCards = {
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
export const discardYourHand = {
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
export function targetCardGainsResist({ target, amount, duration, }) {
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
export function chosenCharacterGainsResist(amount, duration = "next_turn") {
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
export const choseCharacterGainsReckless = {
    type: "ability",
    ability: "reckless",
    duration: "turn",
    modifier: "add",
    target: chosenCharacter,
};
export const theyGainReckless = {
    type: "ability",
    ability: "reckless",
    duration: "turn",
    modifier: "add",
    target: targetTriggerCard,
};
export const chosenCharacterGainsRecklessDuringNextTurn = {
    type: "ability",
    ability: "reckless",
    duration: "next_turn",
    modifier: "add",
    target: chosenCharacter,
};
export const chosenOpposingCharacterGainsRecklessDuringNextTurn = {
    type: "ability",
    ability: "reckless",
    duration: "next_turn",
    modifier: "add",
    target: chosenOpposingCharacter,
};
export const chosenCharacterGainsRush = {
    type: "ability",
    ability: "rush",
    duration: "turn",
    modifier: "add",
    target: chosenCharacter,
};
export const theyGainRush = {
    type: "ability",
    ability: "rush",
    duration: "turn",
    modifier: "add",
    target: targetTriggerCard,
};
export const chosenCharacterGainsSupport = (duration) => {
    return {
        type: "ability",
        ability: "support",
        modifier: "add",
        duration: duration,
        until: true,
        target: chosenCharacter,
    };
};
export const chosenCharacterGainsBodyguard = {
    type: "ability",
    ability: "bodyguard",
    modifier: "add",
    duration: "turn",
    target: chosenCharacter,
};
export const chosenOpposingCharacterCantQuestNextTurn = {
    type: "restriction",
    restriction: "quest",
    duration: "next_turn",
    until: true,
    target: chosenOpposingCharacter,
};
export const chosenOpposingCharacterCantReadyNextTurn = {
    type: "restriction",
    restriction: "ready-at-start-of-turn",
    duration: "next_turn",
    until: true,
    target: chosenOpposingCharacter,
};
export const chosenCharacterGainsEvasive = {
    type: "ability",
    ability: "evasive",
    duration: "turn",
    modifier: "add",
    target: chosenCharacter,
};
export const theyGainEvasive = {
    type: "ability",
    ability: "evasive",
    duration: "turn",
    modifier: "add",
    target: targetTriggerCard,
};
export const thisCharacterGainsEvasive = {
    type: "ability",
    ability: "evasive",
    duration: "static",
    modifier: "add",
    target: thisCard,
};
export const chosenCharacterGainsChallenger = (amount) => {
    return {
        type: "ability",
        ability: "challenger",
        amount,
        duration: "turn",
        modifier: "add",
        target: chosenCharacter,
    };
};
export const chosenCharacterGainsWard = {
    type: "ability",
    ability: "ward",
    duration: "turn",
    modifier: "add",
    target: chosenCharacter,
};
export function putDamageEffect(amount, target) {
    return {
        type: "put-damage",
        amount: amount,
        target: target,
    };
}
export function dealDamageEffect(amount, target) {
    return {
        type: "damage",
        amount: amount,
        target: target,
    };
}
export function healEffect(amount, target, subEffect) {
    return {
        type: "heal",
        amount: amount,
        target: target,
        subEffect: subEffect,
    };
}
export function removeDamageEffect(amount, target) {
    return healEffect(amount, target);
}
export function dealDamageToChosenCharacter(amount) {
    return {
        type: "damage",
        amount: amount,
        target: chosenCharacter,
    };
}
export const dealDamageToChosenOpposingCharacter = (amount) => {
    return {
        type: "damage",
        amount,
        target: chosenOpposingCharacter,
    };
};
export function drawXCards(amount, target = self) {
    return {
        type: "draw",
        amount: amount,
        target,
    };
}
export function yourOtherCharactersGainStrengthThisTurn(amount) {
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
export function chosenOpposingCharacterLoseStrengthUntilNextTurn(amount) {
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
export function opponentCharactersLoseStrengthUntilNextTurn(amount) {
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
export function opponentCharactersLoseStrengthThisTurn(amount) {
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
export function mayBanish(target) {
    return {
        type: "banish",
        target,
    };
}
export const banishChosenCharacter = mayBanish(chosenCharacter);
export const banishYourItem = mayBanish(yourItems);
export const banishChosenCharacterOfYours = mayBanish(chosenCharacterOfYours);
export const banishChosenOpposingCharacter = mayBanish(chosenOpposingCharacter);
export const banishChosenItem = mayBanish(chosenItem);
export const banishChosenItemOrLocation = mayBanish(chosenItemOrLocation);
export const banishChallengingCharacter = mayBanish(challengingCharacter);
export const banishThisCharacter = mayBanish(thisCharacter);
export function returnCardToHand(target) {
    return {
        type: "move",
        to: "hand",
        target: target,
    };
}
export const returnThisCardToHand = returnCardToHand(thisCharacter);
export const putTargetCardIntoTheirInkwell = ({ target, exerted = false, }) => {
    return {
        type: "move",
        to: "inkwell",
        exerted,
        target,
    };
};
export const putThisCardIntoYourInkwellExerted = {
    type: "move",
    to: "inkwell",
    exerted: true,
    target: thisCard,
};
export const putChosenCardFromYourHandIntoYourInkwellExerted = {
    type: "move",
    to: "inkwell",
    exerted: true,
    target: chosenCardFromYourHand,
    isPrivate: true,
};
export const putTopCardOfYourDeckIntoYourInkwellExerted = {
    type: "move",
    to: "inkwell",
    exerted: true,
    target: topCardOfYourDeck,
};
export const putTopCardOfOpponentDeckIntoTheirInkwell = {
    type: "move",
    to: "inkwell",
    target: topCardOfOpponentDeck,
};
export const shuffleThisCardIntoYourDeck = [
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
export function yourOpponentGainLore(amount) {
    return {
        type: "lore",
        modifier: "add",
        amount: amount,
        target: opponent,
    };
}
export function youGainLore(amount) {
    return {
        type: "lore",
        modifier: "add",
        amount: amount,
        target: self,
    };
}
export function opponentLoseLore(amount) {
    return {
        type: "lore",
        modifier: "subtract",
        amount: amount,
        target: opponent,
    };
}
export const eachOpponentLosesLore = opponentLoseLore;
export function eachOpponentLosesXLore(amount) {
    return {
        type: "lore",
        modifier: "subtract",
        amount: amount,
        target: opponent,
    };
}
export function getStrengthThisTurn(amount, target) {
    return {
        type: "attribute",
        attribute: "strength",
        amount: amount,
        modifier: "add",
        duration: "turn",
        target: target,
    };
}
export function getLoreThisTurn(amount, target) {
    return {
        type: "attribute",
        attribute: "lore",
        amount: amount,
        modifier: "add",
        duration: "turn",
        target: target,
    };
}
export function chosenCharacterGetLoreThisTurn(amount) {
    return getLoreThisTurn(amount, chosenCharacter);
}
export function thisCharacterGetsLore(amount) {
    return {
        type: "attribute",
        attribute: "lore",
        amount: amount,
        modifier: "add",
        duration: "turn",
        target: thisCharacter,
    };
}
export function revealTopOfDeckPutInHandOrDeck({ tutorFilters, mode, onTargetMatchEffects, target, }) {
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
export const putOneOnTheTopAndTheOtherOnTheBottomOfYourDeck = {
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
export function youPayXLessToPlayNextCardThisTurn(amount, filters) {
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
export function youPayXLessToPlayNextCharThisTurn(amount, additionalFilters = []) {
    const filters = [
        { filter: "type", value: "character" },
        { filter: "owner", value: "self" },
    ];
    if (additionalFilters.length > 0) {
        filters.push(...additionalFilters);
    }
    return youPayXLessToPlayNextCardThisTurn(amount, filters);
}
export function youPayXLessToPlayNextItemThisTurn(amount) {
    return youPayXLessToPlayNextCardThisTurn(amount, [
        { filter: "type", value: "item" },
    ]);
}
export function youPayXLessToPlayNextLocationThisTurn(amount) {
    return youPayXLessToPlayNextCardThisTurn(amount, [
        { filter: "type", value: "location" },
    ]);
}
export function youPayXLessToPlayNextActionThisTurn(amount) {
    return youPayXLessToPlayNextCardThisTurn(amount, [
        { filter: "type", value: "action" },
    ]);
}
export const opponentCantPlayActions = {
    type: "player-restriction",
    restriction: "play-action-cards",
    target: opponent,
};
export function untilTheEndOfYourNextTurn(effect) {
    return { ...effect, modifier: "add", duration: "next_turn", until: true };
}
export function entersPlayExerted(params) {
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
export const chosenCharacterOfYoursGainsChallengerX = (amount) => ({
    type: "ability",
    ability: "challenger",
    amount,
    modifier: "add",
    duration: "turn",
    target: chosenCharacterOfYours,
});
export const gainsAbilityEffect = ({ ability, target = chosenCharacter, duration = "turn", until, }) => {
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
export const chosenCharacterOfYoursGainsWhenBanishedReturnToHand = {
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
        },
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
export const chosenCharacterCantChallengeDuringNextTurn = {
    type: "restriction",
    restriction: "challenge",
    duration: "next_turn",
    target: chosenCharacter,
};
export const exertAllOpposingCharacters = {
    type: "exert",
    exert: true,
    target: opposingCharacters,
};
export const opponentAsResponderExertOneOfTheirReadyCharacters = {
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
export const returnCharacterFromDiscardToHand = {
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
export function putCardFromDiscardToInkwellFaceDownAndExerted({ filters, }) {
    return moveCardFromXToInkwellFaceDownAndExerted({
        filters,
        isPrivate: false,
        zone: "discard",
    });
}
export function putAllCardsFromDiscardToInkwellFaceDownAndExerted({ filters, }) {
    return moveCardFromXToInkwellFaceDownAndExerted({
        filters,
        isPrivate: false,
        zone: "discard",
        amount: "all",
    });
}
export function moveCardFromXToInkwellFaceDownAndExerted({ filters, zone, isPrivate, amount = 1, }) {
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
export function returnToHand({ filters, excludeSelf = false, }) {
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
export const returnLocationFromDiscardToHand = {
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
export const exertedItemCantReadyNextTurn = {
    type: "restriction",
    restriction: "ready-at-start-of-turn",
    duration: "next_turn",
    target: chosenItem,
};
export const exertedCharCantReadyNextTurn = {
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
export const exertedSelfCharCantReadyNextTurn = {
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
export function returnChosenCharacterToHand() {
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
export function returnChosenCharacterWithCostLess(cost) {
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
export function returnChosenCharacterWithStrength(strength, operator) {
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
export function returnChosenOpposingCharacterWithStrength(strength, operator) {
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
export const exertAndCantReady = (target) => {
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
export function moveDamageEffect({ amount, from, to, conditions, upTo, }) {
    return { type: "move-damage", amount, target: from, to, conditions };
}
export const opponentDrawsACard = {
    type: "draw",
    amount: 1,
    target: {
        type: "player",
        value: "opponent",
    },
};
export const youMayDrawThenChooseAndDiscard = {
    type: "resolution",
    optional: true,
    resolveEffectsIndividually: true,
    effects: [discardACard, drawACard],
};
export const readyAndCantQuest = (target, nonAccumulative = false) => {
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
export const readyAndCantQuestOrChallenge = (target) => {
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
export const opponentRevealHand = {
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
export const damageCharacterOfYours = [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "self" },
    {
        filter: "status",
        value: "damage",
        comparison: { operator: "gte", value: 1 },
    },
];
export const damagedOpposingCharacter = [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "owner", value: "opponent" },
    {
        filter: "status",
        value: "damage",
        comparison: { operator: "gte", value: 1 },
    },
];
export function millOwnXCards(amount) {
    return Array.from({ length: amount }, () => ({
        type: "move",
        to: "discard",
        target: topCardOfYourDeck,
    }));
}
export function millOpponentXCards(amount) {
    return Array.from({ length: amount }, () => ({
        type: "move",
        to: "discard",
        target: topCardOfOpponentDeck,
    }));
}
export function chosenPlayerMillXCards({ amount, }) {
    return {
        type: "mill",
        target: chosenPlayer,
        amount,
    };
}
export const enterPlaysExerted = {
    type: "exert",
    exert: true,
    target: thisCard,
};
export const lookAtTopCardOfYourDeckAndPutItOnTopOrBottom = {
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
export function moveToLocation(target) {
    return {
        type: "move-to-location",
        target: target,
        to: chosenLocationOfYours,
    };
}
export function thisCharacterGetsStrength(amount) {
    return {
        type: "attribute",
        attribute: "strength",
        amount,
        modifier: "add",
        target: thisCharacter,
        duration: "turn",
    };
}
export function chosenCharacterGetsStrength(amount, duration = "turn") {
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
export function revealTopOfDeckPutInPlayOrDeck({ tutorFilters, playFilters, mode, }) {
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
export const damageRemovalRestrictionEffect = {
    type: "restriction",
    restriction: "damage-removal",
    target: thisCharacter,
};
export const damageDealtRestrictionEffect = {
    type: "restriction",
    restriction: "damage-dealt",
    target: thisCharacter,
};
export function getStrengthThisChallenge(amount, target) {
    return {
        type: "attribute",
        attribute: "strength",
        amount: amount,
        modifier: "add",
        duration: "challenge",
        target: target,
    };
}
//# sourceMappingURL=effects.js.map