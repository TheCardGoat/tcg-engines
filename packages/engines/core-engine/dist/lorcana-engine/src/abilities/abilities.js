import { chosenCharacter, otherCharacters, } from "@lorcanito/lorcana-engine/abilities/target";
import { thisCard, whileHereTarget, } from "@lorcanito/lorcana-engine/abilities/targets";
import { dealDamageEffect, moveDamageEffect, } from "@lorcanito/lorcana-engine/effects/effects";
import { atTheEndOfYourTurn } from "./atTheAbilities";
export function exertCharCost(amount) {
    return {
        type: "card",
        action: "exert",
        amount,
        filters: [
            { filter: "owner", value: "self" },
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "status", value: "ready" },
            { filter: "status", value: "dry" },
        ],
    };
}
export function discardCharCost(amount) {
    return {
        type: "card",
        action: "discard",
        amount,
        filters: [
            { filter: "owner", value: "self" },
            { filter: "type", value: "character" },
            { filter: "status", value: "ready" },
            { filter: "zone", value: "hand" },
        ],
    };
}
export function banishItemCost(amount) {
    return {
        type: "card",
        action: "banish",
        amount,
        filters: [
            { filter: "owner", value: "self" },
            { filter: "type", value: "item" },
            { filter: "status", value: "ready" },
        ],
    };
}
export function exertItemCost(amount) {
    return {
        type: "card",
        action: "exert",
        amount,
        filters: [
            { filter: "owner", value: "self" },
            { filter: "type", value: "item" },
            { filter: "status", value: "ready" },
            { filter: "zone", value: "play" },
        ],
    };
}
export const singerAbility = (value) => {
    return {
        type: "static",
        ability: "singer",
        value: value,
        text: `**Singer** +${value} _(This character counts as cost ${value} to sing songs.)_`,
    };
};
export const singerTogetherAbility = (value) => {
    return {
        type: "static",
        ability: "sing-together",
        value: value,
        text: `**Sing Together** ${value} _(Any number of your of your teammates' characters with total cost ${value} or more may {E} to sing this song for free.)_`,
    };
};
export const resistAbility = (value, onlyWhileChallenge) => {
    return {
        type: "static",
        ability: "resist",
        value: value,
        onlyWhileChallenge,
        text: `**Resist** +${value} _(Damage dealt to this character is reduced by ${value}.)_`,
    };
};
export const shiftAbility = (shift, name, text) => {
    const cost = typeof shift === "number" ? [{ type: "ink", amount: shift }] : shift;
    const nameAsText = typeof name === "string" ? name : name.join(" or ");
    const ability = {
        type: "static",
        ability: "shift",
        costs: cost,
        name: `Shift ${shift}`,
        text: text ||
            `**Shift** ${shift} _(You may pay ${shift} {I} to play this on top of one of your characters named ${nameAsText}.)_`,
        additionalNames: typeof name === "string" ? undefined : name,
    };
    return ability;
};
export const challengerAbility = (value) => {
    return {
        type: "static",
        ability: "challenger",
        value: value,
        text: `**Challenger** +${value} (_When challenging, this character get +${value}3 {S}._)`,
    };
};
export const voicelessAbility = {
    ability: "voiceless",
    type: "static",
    text: "This character can't {E} to sing songs.",
};
// 10.7. Rush
// 10.7.1. The Rush keyword represents a static ability. Rush means "This character can challenge as though they were in play at the beginning of your turn."
// 10.7.2. The standard reminder text for Rush is "(This character can challenge the turn they're played.)"
export const rushAbility = {
    ability: "rush",
    type: "static",
    text: "_(This character can challenge the turn they're played.)_",
};
// 10.5. Reckless
// 10.5.1. The Reckless keyword represents two static abilities.
// 10.5.2. The first ability means "This character can't quest."
// 10.5.3. The second ability means "You can't declare the end of your turn if this character is ready and can challenge an opposing exerted character or location."
// 10.5.4. The standard reminder text for Reckless is "(This character can't quest and must challenge each turn if able.)"
// 10.5.5. A player can still exert a character with Reckless to use its abilities or sing songs.
export const recklessAbility = {
    ability: "reckless",
    type: "static",
    text: "_(This character can't quest and must challenge each turn if able.)_",
};
// 10.4. Evasive
// 10.4.1. The Evasive keyword represents a static ability that creates a challenging restriction. Evasive means "This character can't be challenged except by a character with Evasive."
// 10.4.2. The standard reminder text for Evasive is "(Only characters with Evasive can challenge this character.)"
export const evasiveAbility = {
    ability: "evasive",
    type: "static",
    text: "_(Only characters with Evasive can challenge this character.)_",
};
// 10.11.Support
// 10.11.1. The Support keyword represents a triggered ability. Support means "Whenever this character quests, you may add this character's {S} to another chosen character's {S} this turn."
// 10.11.2. The standard reminder text for Support is "(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)"
export const supportAbility = {
    ability: "support",
    type: "static",
    text: "_(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_",
};
// 10.12.Ward
// 10.12.1. The Ward keyword represents a static ability. Ward means "Your opponents can't choose this card when resolving an effect."
// 10.12.2. The standard reminder text for Ward is "(Opponents can't choose this character except to challenge.)"
// 10.12.3. Effects that don't require the player to choose still affect this character.
export const wardAbility = {
    type: "static",
    ability: "ward",
    text: "_(Opponents can't choose this character except to challenge.)_",
};
export const metaAbility = ({ text, name, }) => {
    return {
        type: "static",
        ability: "meta",
        name: name,
        text: text,
    };
};
// 10.XX.Vanish
// 10.XX.1. The Vanish keyword represents a static ability. Vanish means "When an opponent chooses this character for an action, banish them."
// 10.XX.2. The standard reminder text for Ward is "()"
export const vanishAbility = {
    type: "static",
    ability: "vanish",
    text: "_(When an opponent chooses this character for an action, banish them.)_",
};
// 10.2. Bodyguard
// 10.2.1. The Bodyguard keyword represents two abilities.
// 10.2.2. The first of these is a static ability that functions while the character is being played and creates a replacement effect. This ability means "When you play this character, they may enter play exerted instead of ready."
// 10.2.3. The second is a static ability that creates a challenging restriction. This ability means "If an opponent would choose one of your characters to challenge, they must choose this character or another character with Bodyguard if able."
// 10.2.4. The standard reminder text for Bodyguard is "(This character may enter
export const bodyguardAbility = {
    ability: "bodyguard",
    type: "static",
    text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
};
// 10.3. Challenger
// 10.3.1. The Challenger keyword represents a static ability that functions while a character is challenging. Challenger +N means "While this character is challenging, they gain +N {S}." Because this is a +N ability, it stacks with other Challenger effects.
// 10.3.2. The standard reminder text for Challenger is "(While challenging, this character gets +N {S}.)
// 10.3.3. A character with Challenger doesn't gain +N {S} if they are being challenged.
export const challengeReadyCharacters = {
    type: "static",
    ability: "challenge-ready-chars",
};
export const protectorAbility = {
    type: "static",
    ability: "protector",
};
// TODO: What's the difference between this and wheneverBanishesAnotherCharacterInChallenge?
export const duringYourTurnWheneverBanishesCharacterInChallenge = (params) => {
    const { detrimental, optional, effects, name, text } = params;
    const trigger = {
        on: "banish",
        in: "challenge",
        as: "attacker",
        exclude: "source",
        filters: [{ filter: "type", value: "character" }],
    };
    const ability = {
        type: "resolution",
        detrimental,
        optional,
        name,
        text,
        effects,
    };
    return {
        type: "static-triggered",
        name,
        text,
        trigger: trigger,
        layer: ability,
    };
};
export const duringYourTurnWheneverBanishesItem = (params) => {
    const { detrimental, optional, effects, name, text } = params;
    const trigger = {
        on: "banish",
        filters: [{ filter: "type", value: "item" }],
    };
    const ability = {
        type: "resolution",
        detrimental,
        optional,
        name,
        text,
        effects,
    };
    return {
        type: "static-triggered",
        name,
        text,
        trigger: trigger,
        layer: ability,
    };
};
export const duringYourTurnGains = (name, text, ability) => {
    return {
        type: "static",
        ability: "gain-ability",
        name: name,
        text: text,
        target: thisCard,
        gainedAbility: ability,
        conditions: [
            {
                type: "during-turn",
                value: "self",
            },
        ],
    };
};
export const duringYourTurnThisCharacterGains = ({ name, text, ability, conditions = [], }) => {
    return {
        type: "static",
        ability: "gain-ability",
        name: name,
        text: text,
        conditions: [
            ...conditions,
            {
                type: "during-turn",
                value: "self",
            },
        ],
        target: thisCard,
        gainedAbility: ability,
    };
};
export function targetCharacterGains(params) {
    const { gainedAbility, target, name, text, conditions } = params;
    const ability = {
        type: "static",
        ability: "gain-ability",
        name,
        text,
        gainedAbility,
        target,
        conditions,
    };
    return ability;
}
export const yourOtherCharactersWithGain = (params) => {
    const { gainedAbility, filter, name, text } = params;
    return targetCharacterGains({
        gainedAbility,
        name,
        text,
        target: {
            type: "card",
            value: "all",
            excludeSelf: true,
            filters: [
                { filter: "zone", value: "play" },
                { filter: "type", value: "character" },
                { filter: "owner", value: "self" },
                filter,
            ],
        },
    });
};
export const chosenCharacterGains = (params) => {
    const { gainedAbility, name, text } = params;
    return targetCharacterGains({
        gainedAbility,
        name,
        text,
        target: chosenCharacter,
    });
};
export const otherCharacterGains = (params) => {
    const { gainedAbility, name, text } = params;
    return targetCharacterGains({
        gainedAbility,
        name,
        text,
        target: otherCharacters,
    });
};
export const madameMimAbility = {
    type: "resolution",
    text: "When you play this character, banish her or return another chosen character of yours to your hand.",
    optional: true,
    effects: [
        {
            type: "move",
            to: "hand",
            target: {
                type: "card",
                value: 1,
                // TODO: IMPLEMENT THIS, target modal will show her
                excludeSelf: true,
                filters: [
                    { filter: "zone", value: "play" },
                    { filter: "owner", value: "self" },
                    { filter: "type", value: "character" },
                    { filter: "source", value: "other" },
                ],
            },
        },
    ],
    onCancelLayer: {
        type: "resolution",
        effects: [
            {
                type: "banish",
                target: {
                    type: "card",
                    value: "all",
                    filters: [{ filter: "source", value: "self" }],
                },
            },
        ],
    },
};
export function moveDamageAbility(params) {
    const { amount, from, to, optional } = params;
    return {
        type: "resolution",
        optional: optional,
        effects: [
            moveDamageEffect({
                amount,
                from,
                to,
            }),
        ],
    };
}
export function gainAbilityWhileHere({ ability, name, text, target = whileHereTarget, conditions, }) {
    return {
        type: "static",
        ability: "gain-ability",
        gainedAbility: ability,
        conditions,
        name,
        text,
        target,
    };
}
export const foodFightAbility = {
    type: "activated",
    costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
    optional: false,
    name: "Food Fight",
    text: "{E}, 1 {I} – Deal 1 damage to chosen character",
    effects: [dealDamageEffect(1, chosenCharacter)],
};
export function reverseChallenge(name, value) {
    return {
        name,
        value,
        type: "static",
        text: `While being challenged, this character gets +${value} {S}.`,
        ability: "reverse-challenger",
    };
}
export function charactersWithCostXorLessCantChallenge({ cost, name, text, }) {
    const ability = {
        type: "static",
        name,
        text,
        ability: "effects",
        effects: [
            {
                type: "restriction",
                restriction: "challenge",
                duration: "turn",
                target: {
                    type: "card",
                    value: "all",
                    filters: [
                        { filter: "type", value: "character" },
                        { filter: "zone", value: "play" },
                        { filter: "owner", value: "opponent" },
                        {
                            filter: "attribute",
                            value: "cost",
                            comparison: { operator: "lte", value: cost },
                        },
                    ],
                },
            },
        ],
    };
    return ability;
}
export function yourOtherCharactersGet({ name, text, effects, }) {
    return {
        type: "static",
        ability: "effects",
        name,
        text,
        effects,
    };
}
export const chosenExertedCharacterCantReadyWhileThisIsInPlace = {
    type: "resolution",
    name: "",
    text: "",
    effects: [
        {
            type: "restriction",
            restriction: "ready-at-start-of-turn",
            duration: "static",
            target: {
                type: "card",
                value: 1,
                filters: [
                    { filter: "status", value: "exerted" },
                    { filter: "type", value: "character" },
                    { filter: "zone", value: "play" },
                ],
            },
        },
    ],
};
export function yourCharactersNamedGain({ name, ability, excludeSelf, }) {
    return {
        type: "static",
        ability: "gain-ability",
        name: "Dexterous Lunge",
        text: "Your characters named Jetsam gain **Rush.**",
        gainedAbility: ability,
        target: {
            type: "card",
            value: "all",
            excludeSelf,
            filters: [
                { filter: "zone", value: "play" },
                { filter: "type", value: "character" },
                { filter: "owner", value: "self" },
                {
                    filter: "attribute",
                    value: "name",
                    comparison: { operator: "eq", value: name },
                },
            ],
        },
    };
}
const targetTriggerCard = {
    type: "card",
    value: "all",
    filters: [{ filter: "source", value: "trigger" }],
};
const banishSelf = {
    type: "banish",
    target: targetTriggerCard,
};
export const atEndOfTurnBanishItself = atTheEndOfYourTurn({
    effects: [banishSelf],
    // target: thisCard,
});
//# sourceMappingURL=abilities.js.map