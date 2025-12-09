import { chosenCharacterOrLocation, chosenItem, } from "@lorcanito/lorcana-engine/abilities/target";
import { allYourCharacters, chosenCharacter, chosenCharacterOfYours, chosenCharacterOfYoursAtLocation, chosenOpposingCharacter, eachOfYourCharacters, oneOfYourCharacters, self, topCardOfOpponentsDeck, topCardOfYourDeck, yourCharacters, } from "@lorcanito/lorcana-engine/abilities/targets";
import { chosenCharacterGainsSupport, discardACard, drawACard, getStrengthThisTurn, moveDamageEffect, moveToLocation, opponentRevealHand, readyAndCantQuest, youGainLore, } from "@lorcanito/lorcana-engine/effects/effects";
export const iveGotADream = {
    id: "ntx",
    name: "I've Got a Dream",
    characteristics: ["action", "song"],
    text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\n\nReady chosen character of yours at a location. They can't quest for the rest of this turn. Gain lore equal to that location {L}.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            effects: [
                ...readyAndCantQuest(chosenCharacterOfYoursAtLocation),
                {
                    type: "create-layer-based-on-target",
                    resolveAmountBeforeCreatingLayer: true,
                    effects: [
                        youGainLore({
                            dynamic: true,
                            targetLocation: { attribute: "lore" },
                        }),
                    ],
                    // TODO: Get rid of target
                    target: allYourCharacters,
                },
            ],
        },
    ],
    flavour: "Tor would like to quit and be a florist \nGunther does interior design",
    inkwell: true,
    colors: ["ruby"],
    cost: 2,
    illustrator: "Cacciatore Michaela",
    number: 129,
    set: "ITI",
    rarity: "uncommon",
};
export const NnPuppies = {
    id: "cba",
    name: "99 Puppies",
    characteristics: ["action"],
    text: "Whenever one of your characters quests this turn, gain 1 lore.",
    type: "action",
    abilities: [
        {
            type: "floating-triggered",
            duration: "turn",
            trigger: {
                on: "quest",
                target: oneOfYourCharacters,
            },
            layer: {
                type: "resolution",
                effects: [
                    {
                        type: "lore",
                        amount: 1,
                        modifier: "add",
                        target: self,
                    },
                ],
            },
        },
    ],
    flavour: "Two, four, six, and three is nine, plus two is 11 . . . \n−Roger",
    colors: ["amber"],
    cost: 5,
    illustrator: "Agnes Christianson",
    number: 24,
    set: "ITI",
    rarity: "uncommon",
};
export const bosssOrders = {
    id: "tqk",
    missingTestCase: true,
    name: "Boss's Orders",
    characteristics: ["action"],
    text: "Chosen character gains **Support** this turn. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
    type: "action",
    abilities: [
        {
            type: "resolution",
            name: "Boss's Orders",
            text: "Chosen character gains **Support** this turn",
            effects: [chosenCharacterGainsSupport("turn")],
        },
    ],
    flavour: "Snoops! I know you can look harder! Find me that lore! \n−Madame Medusa",
    inkwell: true,
    colors: ["amber"],
    cost: 1,
    illustrator: "Zuzana Sokolova / Livio Cacciatore",
    number: 25,
    set: "ITI",
    rarity: "common",
};
export const healWhatHasBeenHurt = {
    id: "ao1",
    missingTestCase: true,
    name: "Heal What Has Been Hurt",
    characteristics: ["action", "song"],
    text: "_(A character with cost 3 or more can {E} to sing this song for free.)_\n \nRemove up to 3 damage from chosen character. Draw a card.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            name: "Heal What Has Been Hurt",
            text: "Remove up to 3 damage from chosen character. Draw a card.",
            effects: [
                {
                    type: "heal",
                    amount: 3,
                    target: chosenCharacter,
                },
                drawACard,
            ],
        },
    ],
    flavour: "Let your power shine \nMake the clock reverse . . .",
    inkwell: true,
    colors: ["amber"],
    cost: 3,
    illustrator: "Monica Catalano",
    number: 26,
    set: "ITI",
    rarity: "common",
};
export const quickPatch = {
    id: "p6z",
    missingTestCase: true,
    name: "Quick Patch",
    characteristics: ["action"],
    text: "Remove up to 3 damage from chosen location.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            effects: [
                {
                    type: "heal",
                    amount: 2,
                    target: {
                        type: "card",
                        value: 1,
                        filters: [
                            { filter: "type", value: "location" },
                            { filter: "zone", value: "play" },
                        ],
                    },
                },
            ],
        },
    ],
    flavour: "Good as new! Well, almost.",
    inkwell: true,
    colors: ["amber"],
    cost: 1,
    illustrator: "Wouter Bruneel",
    number: 27,
    set: "ITI",
    rarity: "common",
};
export const theBareNecessities = {
    id: "vhx",
    missingTestCase: true,
    name: "The Bare Necessities",
    characteristics: ["action", "song"],
    text: "_(A character with cost 2 or more can Exert.png to sing this song for free.)_\n\n\nChosen opponent reveals their hand and discards a non-character card of your choice.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            resolveEffectsIndividually: true,
            effects: [
                opponentRevealHand,
                {
                    type: "discard",
                    amount: 1,
                    target: {
                        type: "card",
                        value: 1,
                        filters: [
                            { filter: "type", value: ["location", "item", "action"] },
                            { filter: "zone", value: "hand" },
                            { filter: "owner", value: "opponent" },
                        ],
                    },
                },
                opponentRevealHand,
            ],
        },
    ],
    flavour: "Forget about your worries and your strife. . . .",
    inkwell: true,
    colors: ["amber"],
    cost: 2,
    illustrator: "Maxine Vee / David Navarro Arenas",
    number: 28,
    set: "ITI",
    rarity: "rare",
};
export const bestowAGift = {
    id: "v46",
    missingTestCase: true,
    name: "Bestow a Gift",
    characteristics: ["action"],
    text: "Move 1 damage counter from chosen character to chosen opposing character.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            effects: [
                moveDamageEffect({
                    amount: 1,
                    from: chosenCharacter,
                    to: chosenOpposingCharacter,
                }),
            ],
        },
    ],
    flavour: '"From magic ink I call this gift \nFly my minion, thy wings be swift!" \n- Maleficent',
    inkwell: true,
    colors: ["amethyst"],
    cost: 1,
    illustrator: "Dylan Bonner",
    number: 60,
    set: "ITI",
    rarity: "common",
};
export const itCallsMe = {
    id: "jqp",
    missingTestCase: true,
    name: "It Calls Me",
    characteristics: ["action", "song"],
    text: "Draw a card. Shuffle up to 3 cards from your opponent's discard into your opponent's deck.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            name: "Draw a card. Shuffle up to 3 cards from your opponent's discard into your opponent's deck.",
            resolveEffectsIndividually: true,
            effects: [
                {
                    type: "shuffle",
                    amount: 3,
                    target: {
                        type: "card",
                        value: 3,
                        upTo: true,
                        filters: [
                            { filter: "zone", value: "discard" },
                            { filter: "owner", value: "opponent" },
                        ],
                    },
                },
                drawACard,
            ],
        },
    ],
    flavour: "I am everything I've learned and more",
    inkwell: true,
    colors: ["amethyst"],
    cost: 1,
    illustrator: "Luis Huerta",
    number: 61,
    set: "ITI",
    rarity: "uncommon",
};
export const lastDitchEffort = {
    id: "b2t",
    missingTestCase: true,
    name: "Last-Ditch Effort",
    characteristics: ["action"],
    text: "Exert chosen opposing character. Then chosen character of yours gains **Challenger** +2 this turn. (They get +2 {S} while challenging.)",
    type: "action",
    abilities: [
        {
            type: "resolution",
            resolveEffectsIndividually: true,
            effects: [
                {
                    type: "ability",
                    ability: "challenger",
                    amount: 2,
                    modifier: "add",
                    duration: "turn",
                    target: chosenCharacterOfYours,
                },
                {
                    type: "exert",
                    exert: true,
                    target: chosenOpposingCharacter,
                },
            ],
        },
    ],
    flavour: "I got your back",
    colors: ["amethyst"],
    cost: 3,
    illustrator: "Ian MacDonald",
    number: 62,
    set: "ITI",
    rarity: "uncommon",
};
export const theBossIsOnARoll = {
    id: "lfb",
    missingTestCase: true,
    name: "The Boss Is on a Roll",
    characteristics: ["action", "song"],
    text: "_(A character with cost 3 or more can {E} to sing this song for free.)_\n\n\nLook at the top 5 cards of your deck. Put any number of them on the top or the bottom of your deck in any order. Gain 1 lore.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            name: "Look at the top 5 cards of your deck. Put any number of them on the top or the bottom of your deck in any order. Gain 1 lore.",
            resolveEffectsIndividually: true,
            effects: [
                youGainLore(1),
                {
                    type: "scry",
                    amount: 5,
                    mode: "both",
                    target: self,
                    limits: {
                        bottom: 5,
                        inkwell: 0,
                        hand: 0,
                        top: 5,
                    },
                },
            ],
        },
    ],
    flavour: "Go ahead! Make your choice!",
    inkwell: true,
    colors: ["amethyst"],
    cost: 3,
    illustrator: "Koni",
    number: 63,
    set: "ITI",
    rarity: "rare",
};
export const touchedMyHeart = {
    id: "ee8",
    name: "Has Set My Heaaaaaaart ...",
    characteristics: ["action", "song"],
    text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\n\n\nBanish chosen item.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            name: "Banish chosen item.",
            effects: [
                {
                    type: "banish",
                    target: chosenItem,
                },
            ],
        },
    ],
    flavour: "He's not real smart, and yet, \nhe's touched my little cowhide heart.",
    inkwell: true,
    colors: ["emerald"],
    cost: 2,
    illustrator: "Hyuna Lee",
    number: 94,
    set: "ITI",
    rarity: "uncommon",
};
export const iWillFindMyWay = {
    id: "qdn",
    missingTestCase: true,
    name: "I Will Find My Way",
    characteristics: ["action", "song"],
    text: "_(A character with cost 1 or more can {E} to sing this song for free.)_\n\n\nChosen character of yours gets +2 {S} this turn. They may move to a location for free.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            effects: [
                getStrengthThisTurn(2, chosenCharacter),
                moveToLocation(chosenCharacter),
            ],
        },
    ],
    flavour: "I would go most anywhere \nTo feel like I belong",
    inkwell: true,
    colors: ["emerald"],
    cost: 1,
    illustrator: "Carmine Pucci",
    number: 95,
    set: "ITI",
    rarity: "common",
};
export const strikeAGoodMatch = {
    id: "fd2",
    missingTestCase: true,
    name: "Strike a Good Match",
    characteristics: ["action", "song"],
    text: "_(A character with cost 2 or more can Exert.png to sing this song for free.)_\n\n\nDraw 2 cards, then choose and discard a card.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            name: "Strike a Good Match",
            text: "Draw 2 cards, then choose and discard a card.",
            resolveEffectsIndividually: true,
            effects: [discardACard, drawACard, drawACard],
        },
    ],
    flavour: "Please bring honor to us \nPlease bring honor to us all",
    inkwell: true,
    colors: ["emerald"],
    cost: 2,
    illustrator: "Maxine Vee",
    number: 96,
    set: "ITI",
    rarity: "common",
};
export const divebomb = {
    id: "zm8",
    missingTestCase: true,
    name: "Divebomb",
    characteristics: ["action"],
    text: "Banish one of your characters with **Reckless** to banish chosen character with less {S} than that character.",
    type: "action",
    abilities: [
        {
            name: "Banish one of your characters with **Reckless** to banish chosen character with less {S} than that character.",
        },
    ],
    inkwell: true,
    colors: ["ruby"],
    cost: 3,
    illustrator: "Lisanne Koeteeuw",
    number: 128,
    set: "ITI",
    rarity: "uncommon",
};
export const voyage = {
    id: "y55",
    name: "Voyage",
    characteristics: ["action"],
    text: "Move up to 2 characters of yours to the same location for free.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            effects: [
                moveToLocation({
                    type: "card",
                    value: 2,
                    upTo: true,
                    filters: [
                        { filter: "type", value: "character" },
                        { filter: "zone", value: "play" },
                        { filter: "owner", value: "self" },
                    ],
                }),
            ],
        },
    ],
    flavour: "We were voyagers! Why'd we stop? –Moana",
    inkwell: true,
    colors: ["ruby"],
    cost: 1,
    illustrator: "Alex Shin",
    number: 131,
    set: "ITI",
    rarity: "common",
};
export const distract = {
    id: "hb0",
    missingTestCase: true,
    name: "Distract",
    characteristics: ["action"],
    text: "Chosen character gets -2 {S} this turn. Draw a card.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            effects: [
                {
                    type: "attribute",
                    attribute: "strength",
                    amount: 2,
                    modifier: "subtract",
                    target: chosenCharacter,
                },
                drawACard,
            ],
        },
    ],
    inkwell: true,
    colors: ["sapphire"],
    cost: 2,
    illustrator: "Giuseppe de Maio",
    number: 159,
    set: "ITI",
    rarity: "common",
};
export const friendLikeMe = {
    id: "dje",
    name: "Friend Like Me",
    characteristics: ["action", "song"],
    text: "_(A character with cost 5 or more can exert to sing this song for free.)_\n\n\nEach player puts the top 3 cards of their deck into their inkwell facedown and exerted.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            name: "Friend Like Me",
            text: "Each player puts the top 3 cards of their deck into their inkwell facedown and exerted.",
            effects: [
                {
                    type: "move",
                    to: "inkwell",
                    exerted: true,
                    target: topCardOfYourDeck,
                },
                {
                    type: "move",
                    to: "inkwell",
                    exerted: true,
                    target: topCardOfYourDeck,
                },
                {
                    type: "move",
                    to: "inkwell",
                    exerted: true,
                    target: topCardOfYourDeck,
                },
                {
                    type: "move",
                    to: "inkwell",
                    exerted: true,
                    target: topCardOfOpponentsDeck,
                },
                {
                    type: "move",
                    to: "inkwell",
                    exerted: true,
                    target: topCardOfOpponentsDeck,
                },
                {
                    type: "move",
                    to: "inkwell",
                    exerted: true,
                    target: topCardOfOpponentsDeck,
                },
            ],
        },
    ],
    flavour: "You got some power in your corner now",
    inkwell: true,
    colors: ["sapphire"],
    cost: 5,
    illustrator: "Emily Abeydeera",
    number: 160,
    set: "ITI",
    rarity: "rare",
};
export const howFarIllGo = {
    id: "x7c",
    name: "How Far I'll Go",
    characteristics: ["action", "song"],
    text: "_(A character with cost 4 or more can {E} to sing this song for free.)_\n\n\nLook at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            text: "Look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.",
            effects: [
                {
                    type: "scry",
                    amount: 2,
                    mode: "inkwell",
                    shouldRevealTutored: false,
                    target: self,
                    limits: {
                        bottom: 0,
                        top: 0,
                        hand: 1,
                        inkwell: 1,
                    },
                    tutorFilters: [
                        { filter: "owner", value: "self" },
                        { filter: "zone", value: "deck" },
                    ],
                },
            ],
        },
    ],
    colors: ["sapphire"],
    cost: 4,
    illustrator: "Anna Rud / Anna Stosik",
    number: 161,
    set: "ITI",
    rarity: "uncommon",
};
export const repair = {
    id: "wr7",
    missingTestCase: true,
    name: "Repair",
    characteristics: ["action"],
    text: "Remove up to 3 damage from one of your locations or characters.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            effects: [
                {
                    type: "heal",
                    amount: 2,
                    target: {
                        type: "card",
                        value: 1,
                        filters: [
                            { filter: "type", value: ["location", "character"] },
                            { filter: "zone", value: "play" },
                        ],
                    },
                },
            ],
        },
    ],
    flavour: "I'm thinkin' about opening a shop here. What do you think?",
    inkwell: true,
    colors: ["sapphire"],
    cost: 2,
    illustrator: "Denny Minonne",
    number: 162,
    set: "ITI",
    rarity: "common",
};
export const andThenAlongCameZeus = {
    id: "k6i",
    name: "And Then Along Came Zeus",
    characteristics: ["action", "song"],
    text: "_(A character with cost 4 or more can {E} to sing this song for free.)_\n\nDeal 5 damage to chosen character or location.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            name: "And Then Along Came Zeus",
            text: "Deal 5 damage to chosen character or location.",
            effects: [
                {
                    type: "damage",
                    amount: 5,
                    target: chosenCharacterOrLocation,
                },
            ],
        },
    ],
    flavour: "He hurled his thunderbolt−He zapped \nLocked those suckers in a vault−They're trapped \nAnd on his own stopped chaos in its tracks",
    colors: ["steel"],
    cost: 4,
    illustrator: "Isabella Ceravolo",
    number: 195,
    set: "ITI",
    rarity: "rare",
};
export const baBoom = {
    id: "oaj",
    name: "Ba-Boom!",
    characteristics: ["action"],
    text: "Deal 2 damage to chosen character or location.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            name: "Ba-Boom!",
            text: "Deal 2 damage to chosen character or location.",
            effects: [
                {
                    type: "damage",
                    amount: 2,
                    target: {
                        type: "card",
                        value: 1,
                        filters: [
                            { filter: "type", value: ["location", "character"] },
                            { filter: "zone", value: "play" },
                        ],
                    },
                },
            ],
        },
    ],
    flavour: "Bigger than your average boom!",
    inkwell: true,
    colors: ["steel"],
    cost: 2,
    illustrator: "Heidi Neunhoffer",
    number: 196,
    set: "ITI",
    rarity: "common",
};
export const olympusWouldBeThatWay = {
    id: "w88",
    missingTestCase: true,
    name: "Olympus Would Be That Way",
    characteristics: ["action"],
    text: "Your characters get +3 {S} this turn while challenging a location.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            effects: [
                {
                    type: "ability",
                    ability: "challenger",
                    amount: 3,
                    modifier: "add",
                    duration: "turn",
                    target: yourCharacters,
                },
            ],
        },
    ],
    flavour: "Now that I set you free, what is the first thing you are going to do? \n–Hades",
    inkwell: true,
    colors: ["steel"],
    cost: 1,
    illustrator: "Michaela Martin",
    number: 197,
    set: "ITI",
    rarity: "common",
};
export const riseOfTheTitans = {
    id: "ukw",
    name: "Rise of the Titans",
    characteristics: ["action"],
    text: "Banish chosen location or item.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            name: "Rise of the Titans",
            text: "Banish chosen location or item.",
            effects: [
                {
                    type: "banish",
                    target: {
                        type: "card",
                        value: 1,
                        filters: [
                            { filter: "type", value: ["location", "item"] },
                            { filter: "zone", value: "play" },
                        ],
                    },
                },
            ],
        },
    ],
    flavour: "Oh, we're in trouble, big trouble! \n–Hermes",
    inkwell: true,
    colors: ["steel"],
    cost: 3,
    illustrator: "Nicola Saviori",
    number: 198,
    set: "ITI",
    rarity: "uncommon",
};
export const onYourFeetNow = {
    id: "wna",
    missingTestCase: true,
    name: "On Your Feet! Now!",
    characteristics: ["action"],
    text: "Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            text: "Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.",
            effects: [
                ...readyAndCantQuest(allYourCharacters),
                {
                    type: "damage",
                    amount: 1,
                    target: eachOfYourCharacters,
                },
            ],
        },
    ],
    flavour: "Catch them! Before they get away!",
    colors: ["ruby"],
    illustrator: "Lisanne Koeteeuw",
    number: 130,
    cost: 4,
    set: "ITI",
    rarity: "rare",
};
//# sourceMappingURL=actions.js.map