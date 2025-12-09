import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { allOpposingCharacters, chosenCharacter, chosenDamagedCharacter, chosenItem, chosenLocation, chosenPlayer, eachOfYourCharacters, eachOpposingCharacter, opponent, self, thisCharacter, withCostXorLess, } from "@lorcanito/lorcana-engine/abilities/targets";
import { banishChosenItem, chosenCharacterGainsResist, chosenCharacterGainsRush, dealDamageEffect, discardACard, drawXCards, exertedSelfCharCantReadyNextTurn, } from "@lorcanito/lorcana-engine/effects/effects";
export const brunosReturn = {
    id: "azx",
    missingTestCase: true,
    name: "Bruno's Return",
    characteristics: ["action"],
    text: "Return a character card from your discard to your hand. Then remove up to 2 damage from chosen character.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            text: "Return a character card from your discard to your hand. Then remove up to 2 damage from chosen character.",
            resolveEffectsIndividually: true,
            effects: [
                {
                    type: "heal",
                    amount: 2,
                    target: chosenCharacter,
                },
                {
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
                },
            ],
        },
    ],
    colors: ["amber"],
    cost: 2,
    illustrator: "Cristian Romero",
    number: 26,
    set: "URR",
    rarity: "uncommon",
};
export const firstAid = {
    id: "r1q",
    missingTestCase: true,
    name: "First Aid",
    characteristics: ["action"],
    text: "Remove up to 1 damage from each of your characters.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            text: "Remove up to 1 damage from each of your characters.",
            effects: [
                {
                    type: "heal",
                    amount: 1,
                    target: eachOfYourCharacters,
                },
            ],
        },
    ],
    flavour: "There, now - isn't that better?",
    inkwell: true,
    colors: ["amber"],
    cost: 1,
    illustrator: "Gonzalo Kenny",
    number: 27,
    set: "URR",
    rarity: "common",
};
export const lookAtThisFamily = {
    id: "hgt",
    missingTestCase: true,
    name: "Look At This Family",
    characteristics: ["action", "song"],
    text: "**Sing Together** 7 _(Any number of your of your teammates' characters with total cost 7 or more may {E} to sing this song for free.)_\n\n\nLook at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
    type: "action",
    abilities: [
        singerTogetherAbility(7),
        {
            type: "resolution",
            effects: [
                {
                    type: "scry",
                    amount: 5,
                    mode: "bottom",
                    shouldRevealTutored: true,
                    target: self,
                    limits: {
                        bottom: 5,
                        inkwell: 0,
                        hand: 2,
                        top: 0,
                        discard: 0,
                    },
                    tutorFilters: [
                        { filter: "owner", value: "self" },
                        { filter: "zone", value: "deck" },
                        { filter: "type", value: "character" },
                    ],
                },
            ],
        },
    ],
    inkwell: true,
    colors: ["amber"],
    cost: 7,
    illustrator: "Giulia Riva",
    number: 28,
    set: "URR",
    rarity: "rare",
};
export const lostInTheWoods = {
    id: "p0f",
    missingTestCase: true,
    name: "Lost in the Woods",
    characteristics: ["action", "song"],
    text: "_(A character with cost 4 or more can {E} to sing this song for free.)_\n\n\nAll opposing characters get -2 {S} until the start of your next turn.",
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
                    duration: "next_turn",
                    until: true,
                    target: allOpposingCharacters,
                },
            ],
        },
    ],
    flavour: "I'm left behind, wondering if I should follow",
    inkwell: true,
    colors: ["amber"],
    cost: 4,
    illustrator: "Ellie Horie",
    number: 29,
    set: "URR",
    rarity: "uncommon",
};
const abilitySignTheScroll = {
    type: "resolution",
    text: "Each opponent may chose and discard a card. For each opponent who doesn't, you gain 2 lore.",
    responder: "opponent",
    effects: [
        {
            type: "modal",
            // TODO: Get rid of target
            target: chosenCharacter,
            modes: [
                {
                    id: "1",
                    text: "Discard a card",
                    effects: [
                        {
                            type: "discard",
                            amount: 1,
                            target: {
                                type: "card",
                                value: 1,
                                filters: [
                                    { filter: "zone", value: "hand" },
                                    { filter: "owner", value: "self" },
                                ],
                            },
                        },
                    ],
                },
                {
                    id: "2",
                    text: "Opponent Gain 2 Lore",
                    effects: [
                        {
                            type: "lore",
                            amount: 2,
                            modifier: "add",
                            target: opponent,
                        },
                    ],
                },
            ],
        },
    ],
};
export const signTheScroll = {
    id: "x7p",
    missingTestCase: true,
    name: "Sign The Scroll",
    characteristics: ["action"],
    text: "Each opponent may chose and discard a card. For each opponent who doesn't, you gain 2 lore.",
    type: "action",
    abilities: [abilitySignTheScroll],
    colors: ["amber"],
    cost: 3,
    illustrator: "Mariana Moreno Ayala",
    number: 30,
    set: "URR",
    rarity: "uncommon",
};
export const poorUnfortunateSouls = {
    id: "d2i",
    missingTestCase: true,
    name: "Poor Unfortunate Souls",
    characteristics: ["action", "song"],
    text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\n\n\nReturn a character, item or location with cost 2 or less to their player’s hand.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            effects: [
                {
                    type: "move",
                    to: "hand",
                    target: {
                        type: "card",
                        value: 1,
                        filters: [
                            { filter: "type", value: ["character", "location", "item"] },
                            { filter: "zone", value: "play" },
                            withCostXorLess(2),
                        ],
                    },
                },
            ],
        },
    ],
    flavour: "It’s sad but true",
    inkwell: true,
    colors: ["amethyst"],
    cost: 2,
    illustrator: "Denny Minonne",
    number: 60,
    set: "URR",
    rarity: "common",
};
export const secondStarToTheRight = {
    id: "k7z",
    missingTestCase: true,
    name: "Second Star To The Right",
    characteristics: ["action", "song"],
    text: "**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_\n\n\nChosen player draws 5 cards.",
    type: "action",
    abilities: [
        singerTogetherAbility(10),
        {
            type: "resolution",
            effects: [drawXCards(5, chosenPlayer)],
        },
    ],
    flavour: "Lead us to the land we dream of",
    colors: ["amethyst"],
    cost: 10,
    illustrator: "Natalia Trykowska",
    number: 61,
    set: "URR",
    rarity: "rare",
};
export const swingIntoAction = {
    id: "bho",
    missingTestCase: true,
    name: "Swing Into Action",
    characteristics: ["action"],
    text: "Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
    type: "action",
    abilities: [
        {
            type: "resolution",
            effects: [chosenCharacterGainsRush],
        },
    ],
    inkwell: true,
    colors: ["amethyst"],
    cost: 1,
    illustrator: "Wouter Bruneel",
    number: 62,
    set: "URR",
    rarity: "common",
};
export const ursulasPlan = {
    id: "qk9",
    missingTestCase: true,
    name: "Ursula's Plan",
    characteristics: ["action"],
    text: "Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            text: "Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.",
            responder: "opponent",
            effects: [exertedSelfCharCantReadyNextTurn],
        },
    ],
    flavour: "With both the crown and the trident, together we would be unstoppable!",
    colors: ["amethyst"],
    cost: 3,
    illustrator: "Eri Welli",
    number: 63,
    set: "URR",
    rarity: "uncommon",
};
export const dodge = {
    id: "ysq",
    missingTestCase: true,
    name: "Dodge!",
    characteristics: ["action"],
    text: "Chosen character gains **Ward** and **Evasive** until the start of your next turn. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_",
    type: "action",
    abilities: [
        {
            type: "resolution",
            effects: [
                {
                    type: "ability",
                    ability: "ward",
                    duration: "next_turn",
                    modifier: "add",
                    until: true,
                    target: chosenCharacter,
                },
                {
                    type: "ability",
                    ability: "evasive",
                    duration: "next_turn",
                    modifier: "add",
                    until: true,
                    target: chosenCharacter,
                },
            ],
        },
    ],
    flavour: "Missed me, you doggone bully!",
    inkwell: true,
    colors: ["emerald"],
    cost: 2,
    illustrator: "Wouter Bruneel",
    number: 93,
    set: "URR",
    rarity: "common",
};
export const makeThePotion = {
    id: "vwt",
    missingTestCase: true,
    name: "Make the Potion",
    characteristics: ["action"],
    text: "Choose one:\n· Banish chosen item.\n· Deal 2 damage to chosen damaged character.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            text: "Choose one:\n· Banish chosen item.\n· Deal 2 damage to chosen damaged character.",
            effects: [
                {
                    type: "modal",
                    target: chosenCharacter,
                    modes: [
                        {
                            id: "1",
                            text: "Banish chosen item",
                            effects: [banishChosenItem],
                        },
                        {
                            id: "2",
                            text: "Deal 2 damage to chosen damaged character",
                            effects: [dealDamageEffect(2, chosenDamagedCharacter)],
                        },
                    ],
                },
            ],
        },
    ],
    colors: ["emerald"],
    cost: 2,
    illustrator: "Elodie Mondoloni",
    number: 94,
    set: "URR",
    rarity: "common",
};
export const underTheSea = {
    id: "s4i",
    missingTestCase: true,
    name: "Under The Sea",
    characteristics: ["action", "song"],
    text: "Put all opposing characters with 2 {S} or less on the bottom of their players' decks in any order.",
    type: "action",
    abilities: [
        singerTogetherAbility(8),
        {
            type: "resolution",
            effects: [
                {
                    type: "move",
                    to: "deck",
                    bottom: true,
                    target: {
                        type: "card",
                        value: "all",
                        filters: [
                            { filter: "type", value: "character" },
                            { filter: "zone", value: "play" },
                            { filter: "owner", value: "opponent" },
                            {
                                filter: "attribute",
                                value: "strength",
                                comparison: { operator: "lte", value: 2 },
                            },
                        ],
                    },
                },
            ],
        },
    ],
    flavour: "Such wonderful things surround you",
    colors: ["emerald"],
    cost: 8,
    illustrator: "Dylan Bonner",
    number: 95,
    set: "URR",
    rarity: "rare",
};
export const ursulasTrickery = {
    id: "fr4",
    missingTestCase: true,
    name: "Ursula's Trickery",
    characteristics: ["action"],
    text: "Each opponent may choose and discard a card. For each opponent who doesn't, you draw a card.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            responder: "opponent",
            effects: [
                {
                    type: "modal",
                    // TODO: Get rid of target
                    target: chosenCharacter,
                    modes: [
                        {
                            id: "1",
                            text: "Discard a Card.",
                            responder: "opponent",
                            effects: [discardACard],
                        },
                        {
                            id: "2",
                            text: "Opponent Draws a Card.",
                            responder: "opponent",
                            effects: [drawXCards(1, opponent)],
                        },
                    ],
                },
            ],
        },
    ],
    flavour: "How dare you double-cross me! Ursula shouted, lunging at the other glimmer.",
    colors: ["emerald"],
    cost: 1,
    illustrator: "Matthew Robert Davies",
    number: 96,
    set: "URR",
    rarity: "uncommon",
};
export const aPiratesLife = {
    id: "u5v",
    missingTestCase: true,
    name: "A Pirate's Life",
    characteristics: ["action", "song"],
    text: "**Sing Together** 6 _(Any number of your of your teammates' characters with total cost 6 or more may {E} to sing this song for free.)_\n\n\nEach opponent loses 2 lore. You gain 2 lore.",
    type: "action",
    abilities: [
        singerTogetherAbility(6),
        {
            type: "resolution",
            effects: [
                {
                    type: "lore",
                    modifier: "subtract",
                    amount: 2,
                    target: opponent,
                },
                {
                    type: "lore",
                    modifier: "add",
                    amount: 2,
                    target: self,
                },
            ],
        },
    ],
    flavour: "Give me a career\nAs a buccaneer",
    inkwell: true,
    colors: ["ruby"],
    cost: 6,
    illustrator: "Valentina Graziuso",
    number: 128,
    set: "URR",
    rarity: "uncommon",
};
export const beKingUndisputed = {
    id: "o8o",
    name: "Be King Undisputed",
    characteristics: ["action", "song"],
    text: "_(A character with cost 4 or more can {E} to sing this song for free.)_\n\n\nEach opponent chooses and banishes one of their characters.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            name: "Be King Undisputed",
            text: "Each opponent chooses and banishes one of their characters.",
            responder: "opponent",
            effects: [
                {
                    type: "banish",
                    target: {
                        type: "card",
                        value: 1,
                        filters: [
                            { filter: "zone", value: "play" },
                            { filter: "type", value: "character" },
                            { filter: "owner", value: "self" },
                        ],
                    },
                },
            ],
        },
    ],
    flavour: "Respected, saluted",
    colors: ["ruby"],
    cost: 4,
    illustrator: "Emily Abeydeera",
    number: 129,
    set: "URR",
    rarity: "rare",
};
export const brawl = {
    id: "wsx",
    name: "Brawl",
    characteristics: ["action"],
    text: "Banish chosen character with 2 {S} or less.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            name: "Brawl",
            text: "Banish chosen character with 2 {S} or less.",
            effects: [
                {
                    type: "banish",
                    target: {
                        type: "card",
                        value: 1,
                        filters: [
                            { filter: "zone", value: "play" },
                            { filter: "type", value: "character" },
                            {
                                filter: "attribute",
                                value: "strength",
                                comparison: { operator: "lte", value: 2 },
                            },
                        ],
                    },
                },
            ],
        },
    ],
    flavour: "There are two ways to leave the Snuggly Duckling - the door or the window.",
    inkwell: true,
    colors: ["ruby"],
    cost: 3,
    illustrator: "R. la Barbera / L. Giammichele",
    number: 130,
    set: "URR",
    rarity: "common",
};
export const digALittleDeeper = {
    id: "vrj",
    missingTestCase: true,
    name: "Dig A Little Deeper",
    characteristics: ["action", "song"],
    text: "**Sing Together** 8 _(Any number of your of your teammates' characters with total cost 8 or more may {E} to sing this song for free.)_\n\n\nLook at the top 7 cards of your deck. Put 2 into your hand. Put the rest on the bottom of your deck in any order.",
    type: "action",
    abilities: [
        singerTogetherAbility(8),
        {
            type: "resolution",
            effects: [
                {
                    type: "scry",
                    amount: 7,
                    mode: "bottom",
                    shouldRevealTutored: false,
                    target: self,
                    limits: {
                        bottom: 5,
                        inkwell: 0,
                        hand: 2,
                        top: 0,
                        discard: 0,
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
    cost: 8,
    illustrator: "Rachel Elese",
    number: 162,
    set: "URR",
    rarity: "uncommon",
};
export const glaner = {
    id: "aqx",
    name: "Glean",
    characteristics: ["action"],
    text: "Banish chosen item. Its owner gains 2 lore.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            name: "Glean",
            text: "Banish chosen item. Its owner gains 2 lore.",
            effects: [
                {
                    type: "banish",
                    target: chosenItem,
                },
                {
                    type: "lore",
                    amount: 2,
                    modifier: "add",
                    target: { type: "player", value: "target_owner" },
                },
            ],
        },
    ],
    flavour: "This could be just the thing I need to get my invention working.",
    inkwell: true,
    colors: ["sapphire"],
    cost: 1,
    illustrator: "Veronica Di Lorenzo / Livio Cacciatore",
    number: 163,
    set: "URR",
    rarity: "common",
};
export const seldomAllTheySeem = {
    id: "esk",
    missingTestCase: true,
    name: "Seldom All They Seem",
    characteristics: ["action", "song"],
    text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\n\nChosen character gets -3 {S} this turn.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            effects: [
                {
                    type: "attribute",
                    attribute: "strength",
                    amount: 3,
                    modifier: "subtract",
                    target: chosenCharacter,
                },
            ],
        },
    ],
    flavour: "I know you\nI walked with you once upon a dream",
    inkwell: true,
    colors: ["sapphire"],
    cost: 2,
    illustrator: "Rachel Elese",
    number: 164,
    set: "URR",
    rarity: "common",
};
export const treasuresUntold = {
    id: "pzn",
    missingTestCase: true,
    name: "Treasures Untold",
    characteristics: ["action", "song"],
    text: "_(A character with cost 6 or more can {E} to sing this song for free.)_\n\n\nReturn up to 2 item cards from your discard into your hand.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            text: "Return up to 2 item cards from your discard into your hand.",
            effects: [
                {
                    type: "move",
                    to: "hand",
                    target: {
                        type: "card",
                        value: 2,
                        upTo: true,
                        filters: [
                            { filter: "type", value: "item" },
                            { filter: "zone", value: "discard" },
                            { filter: "owner", value: "self" },
                        ],
                    },
                },
            ],
        },
    ],
    flavour: "How many wonders can one cavern hold?",
    inkwell: true,
    colors: ["sapphire"],
    cost: 6,
    illustrator: "Matt Gaser",
    number: 165,
    set: "URR",
    rarity: "rare",
};
export const avalanche = {
    id: "znd",
    name: "Avalanche",
    characteristics: ["action"],
    text: "Deal 1 damage to each opposing character. You may banish chosen location.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            effects: [
                {
                    type: "damage",
                    amount: 1,
                    target: eachOpposingCharacter,
                },
            ],
        },
        {
            type: "resolution",
            optional: true,
            effects: [
                {
                    type: "banish",
                    target: chosenLocation,
                },
            ],
        },
    ],
    flavour: "A little snow never hurt anyone. That big rock, however...",
    colors: ["steel"],
    cost: 4,
    illustrator: "Justin Gerard",
    number: 195,
    set: "URR",
    rarity: "uncommon",
};
export const iFindEmIFlattenEm = {
    id: "h30",
    name: "I Find 'Em, I Flatten 'Em",
    characteristics: ["action", "song"],
    text: "_(A character with cost 4 or more can {E} to sing this song for free.)_\n\n\nBanish all items.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            effects: [
                {
                    type: "banish",
                    target: {
                        type: "card",
                        value: "all",
                        filters: [
                            { filter: "zone", value: "play" },
                            { filter: "type", value: "item" },
                        ],
                    },
                },
            ],
        },
    ],
    flavour: "All the most difficult missions are for me, because I am indestructible.",
    inkwell: true,
    colors: ["steel"],
    cost: 4,
    illustrator: "Jennifer Park",
    number: 196,
    set: "URR",
    rarity: "uncommon",
};
const targetHero = {
    type: "card",
    value: 1,
    filters: [
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        {
            filter: "characteristics",
            value: ["hero"],
        },
    ],
};
export const oneLastHope = {
    id: "b2r",
    name: "One Last Hope",
    characteristics: ["action", "song"],
    text: "_(A character with cost 3 or more can {E} to sing this song for free.)_\n\n\nChosen character gains **Resist** +2 until the start of your next turn. If a Hero character is chosen, they may also challenge ready characters this turn. _(Damage dealt to them is reduced by 2.)_",
    type: "action",
    abilities: [
        {
            type: "resolution",
            effects: [
                {
                    type: "target-conditional",
                    effects: [
                        {
                            type: "ability",
                            ability: "challenge_ready_chars",
                            modifier: "add",
                            duration: "turn",
                            until: true,
                            target: targetHero,
                        },
                        {
                            type: "ability",
                            ability: "resist",
                            amount: 2,
                            modifier: "add",
                            duration: "next_turn",
                            until: true,
                            target: targetHero,
                        },
                    ],
                    fallback: [chosenCharacterGainsResist(2)],
                    // TODO: Re implement conditional target
                    target: targetHero,
                },
            ],
        },
    ],
    colors: ["steel"],
    cost: 3,
    illustrator: "Alice Pisoni",
    number: 197,
    set: "URR",
    rarity: "rare",
};
export const theMobSong = {
    id: "h6n",
    missingTestCase: true,
    name: "The Mob Song",
    characteristics: ["action", "song"],
    text: "**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_\n\n\nDeal 3 damage to up to 3 chosen characters and/or locations.",
    type: "action",
    abilities: [
        singerTogetherAbility(10),
        {
            type: "resolution",
            effects: [
                {
                    type: "damage",
                    amount: 3,
                    target: {
                        type: "card",
                        value: 3,
                        upTo: true,
                        filters: [
                            { filter: "zone", value: "play" },
                            { filter: "type", value: ["character", "location"] },
                        ],
                    },
                },
            ],
        },
    ],
    colors: ["steel"],
    cost: 10,
    illustrator: "Ian MacDonald",
    number: 198,
    set: "URR",
    rarity: "uncommon",
};
export const tritonsDecree = {
    id: "lu9",
    missingTestCase: true,
    name: "Triton's Decree",
    characteristics: ["action"],
    text: "Each opponent chooses one of their characters and deals 2 damage to them.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            text: "Each opponent chooses one of their characters and deals 2 damage to them.",
            responder: "opponent",
            effects: [
                {
                    type: "damage",
                    amount: 2,
                    target: {
                        type: "card",
                        value: 1,
                        filters: [
                            { filter: "type", value: "character" },
                            { filter: "zone", value: "play" },
                            { filter: "owner", value: "self" },
                        ],
                    },
                },
            ],
        },
    ],
    flavour: "Ursula's foul creatures are not welcome in my kingdom!",
    colors: ["steel"],
    cost: 1,
    illustrator: "Carlos Gomes Cabral",
    number: 199,
    set: "URR",
    rarity: "common",
};
export const weDontTalkAboutBruno = {
    id: "wwi",
    name: "We Don't Talk About Bruno",
    characteristics: ["action", "song"],
    text: "Return chosen character to their player's hand, then that player discards a card at random.",
    type: "action",
    abilities: [
        {
            type: "resolution",
            name: "We Don't Talk About Bruno",
            text: "Return chosen character to their player's hand, then that player discards a card at random.",
            effects: [
                {
                    type: "move",
                    to: "hand",
                    target: chosenCharacter,
                    afterEffect: [
                        {
                            type: "create-layer-based-on-target",
                            // TODO: get rid of target
                            target: thisCharacter,
                            responder: "target_card_owner",
                            effects: [
                                {
                                    type: "discard",
                                    amount: 1,
                                    target: {
                                        type: "card",
                                        value: 1,
                                        random: true,
                                        filters: [
                                            { filter: "zone", value: "hand" },
                                            { filter: "owner", value: "self" },
                                        ],
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    inkwell: true,
    colors: ["emerald"],
    cost: 5,
    illustrator: 'Victor "Yano" Covarrubias',
    number: 97,
    set: "URR",
    rarity: "rare",
};
//# sourceMappingURL=actions.js.map