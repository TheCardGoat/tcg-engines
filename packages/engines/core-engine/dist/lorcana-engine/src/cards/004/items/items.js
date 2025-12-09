import { forEachCardInYourHand } from "@lorcanito/lorcana-engine/abilities/amounts";
import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { chosenCharacter, chosenCharacterOfYours, chosenCharacterOrLocation, chosenHeroCharacter, chosenLocation, chosenOpposingCharacter, } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayMayDrawACard } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { wheneverChallengesAnotherChar, wheneverOneOfYourCharChallengesAnotherChar, wheneverOpponentPlaysASong, wheneverYouPlayACharacter, wheneverYouPlayASong, } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import { targetCardsGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import { damageRemovalRestrictionEffect, drawACard, getLoreThisTurn, healEffect, moveDamageEffect, readyAndCantQuest, youGainLore, youPayXLessToPlayNextCharThisTurn, } from "@lorcanito/lorcana-engine/effects/effects";
import { propertyStaticAbilities } from "../../../abilities/propertyStaticAbilities";
export const miracleCandle = {
    id: "ohm",
    missingTestCase: true,
    name: "Miracle Candle",
    characteristics: ["item"],
    text: "**ABUELA'S GIFT** Banish this item − If you have 3 or more characters in play, gain 2 lore and remove up to 2 damage from chosen location.",
    type: "item",
    abilities: [
        {
            type: "activated",
            name: "Abuela's Gift",
            costs: [{ type: "banish" }],
            conditions: [
                {
                    type: "filter",
                    comparison: { operator: "gte", value: 3 },
                    filters: chosenCharacterOfYours.filters,
                },
            ],
            text: "Banish this item − If you have 3 or more characters in play, gain 2 lore and remove up to 2 damage from chosen location.",
            effects: [youGainLore(2), healEffect(2, chosenLocation)],
        },
    ],
    inkwell: true,
    colors: ["amber"],
    cost: 2,
    illustrator: "Kuya Jaypi",
    number: 31,
    set: "URR",
    rarity: "rare",
};
export const recordPlayer = {
    id: "jvf",
    name: "Record Player",
    characteristics: ["item"],
    text: "**LOOK AT THIS!** Whenever you play a song, chosen character gets -2 {S} until the start of your next turn.\n\n**HIT PARADE** Your characters named Stitch count as having +1 cost to sing songs.",
    type: "item",
    abilities: [
        wheneverYouPlayASong({
            name: "LOOK AT THIS!",
            text: "Whenever you play a song, chosen character gets -2 {S} until the start of your next turn.",
            effects: [
                {
                    type: "attribute",
                    attribute: "strength",
                    modifier: "subtract",
                    amount: 2,
                    duration: "next_turn",
                    until: true,
                    target: chosenCharacter,
                },
            ],
        }),
        propertyStaticAbilities({
            name: "HIT PARADE",
            text: "Your characters named Stitch count as having +1 cost to sing songs.",
            attribute: "singCost",
            amount: 1,
            target: {
                type: "card",
                value: "all",
                filters: [
                    { filter: "owner", value: "self" },
                    { filter: "zone", value: "play" },
                    {
                        filter: "attribute",
                        value: "name",
                        comparison: { operator: "eq", value: "stitch" },
                    },
                ],
            },
        }),
    ],
    inkwell: true,
    colors: ["amber"],
    cost: 2,
    illustrator: "Simone Buonfantino",
    number: 32,
    set: "URR",
    rarity: "common",
};
export const mysticalRose = {
    id: "d8l",
    missingTestCase: true,
    name: "Mystical Rose",
    characteristics: ["item"],
    text: "**DISPEL THE ENTANGLEMENT** Banish this item − Chosen character named Beast gets +2 {L} this turn. If you have a character named Belle in play, move up to 3 damage counters from chosen character to chosen opposing character.",
    type: "item",
    abilities: [
        {
            type: "activated",
            costs: [{ type: "banish" }],
            name: "Dispel The Entanglement",
            text: "Banish this item − Chosen character named Beast gets +2 {L} this turn. If you have a character named Belle in play, move up to 3 damage counters from chosen character to chosen opposing character.",
            effects: [
                getLoreThisTurn(2, {
                    type: "card",
                    value: 1,
                    filters: [
                        { filter: "type", value: "character" },
                        { filter: "zone", value: "play" },
                        {
                            filter: "attribute",
                            value: "name",
                            comparison: { operator: "eq", value: "beast" },
                        },
                    ],
                }),
                moveDamageEffect({
                    amount: 3,
                    from: chosenCharacter,
                    to: chosenOpposingCharacter,
                    conditions: [ifYouHaveCharacterNamed("belle")],
                }),
            ],
        },
    ],
    flavour: "Ink surrounded Belle's last hope to heal the Beast. With no other choice, she reached out for it . . .",
    inkwell: true,
    colors: ["amethyst"],
    cost: 2,
    illustrator: "Olivier Désirée",
    number: 64,
    set: "URR",
    rarity: "rare",
};
export const roseLantern = {
    id: "xin",
    missingTestCase: true,
    name: "Rose Lantern",
    characteristics: ["item"],
    text: "MYSTICAL PETALS  {E}, 2 {I} − Move 1 damage counter from chosen character to chosen opposing character.",
    type: "item",
    abilities: [
        {
            type: "activated",
            name: "Mystical Petals",
            text: "{E}, 2 {I} − Move 1 damage counter from chosen character to chosen opposing character.",
            costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
            effects: [
                moveDamageEffect({
                    amount: 1,
                    from: chosenCharacter,
                    to: chosenOpposingCharacter,
                }),
            ],
        },
    ],
    flavour: "The transformed rose made short work of the Beast's wound. But even the gentlest magic comes at a cost.",
    inkwell: true,
    colors: ["amethyst"],
    cost: 2,
    illustrator: "Gabriel Angelo",
    number: 65,
    set: "URR",
    rarity: "common",
};
const effect = {
    type: "attribute",
    attribute: "strength",
    modifier: "add",
    target: chosenCharacter,
    amount: {
        dynamic: true,
        filters: [
            { filter: "zone", value: "hand" },
            { filter: "owner", value: "self" },
        ],
    },
};
export const tritonsTrident = {
    id: "tom",
    missingTestCase: true,
    name: "Triton's Trident",
    characteristics: ["item"],
    text: "**SYMBOL OF POWER** Banish this item — Chosen character gets +1 {S} this turn for each card in your hand.",
    type: "item",
    abilities: [
        {
            type: "activated",
            name: "Symbol Of Power",
            text: "Banish this item — Chosen character gets +1 {S} this turn for each card in your hand.",
            costs: [{ type: "banish" }],
            effects: [
                {
                    type: "attribute",
                    attribute: "strength",
                    modifier: "add",
                    duration: "turn",
                    target: chosenCharacter,
                    amount: forEachCardInYourHand,
                },
            ],
        },
    ],
    flavour: '"Just imagine all this power in the wrong hands..." — Ursula',
    inkwell: true,
    colors: ["amethyst"],
    cost: 2,
    illustrator: "Matt Chapman",
    number: 66,
    set: "URR",
    rarity: "uncommon",
};
export const hiddenInkcaster = {
    id: "efb",
    missingTestCase: true,
    name: "Hidden Inkcaster",
    characteristics: ["item"],
    text: "**FRESH INK** When you play this item, draw a card.\n\n\n**UNEXPECTED TREASURE** All cards in your hand count as having ⏣.",
    type: "item",
    abilities: [
        {
            ...whenYouPlayMayDrawACard,
            name: "Fresh Ink",
        },
    ],
    flavour: "It looks like it's been here forever. \n–Flounder",
    colors: ["emerald"],
    cost: 2,
    illustrator: "Adam Fenton",
    number: 98,
    set: "URR",
    rarity: "common",
};
export const signedContract = {
    id: "nxy",
    missingTestCase: true,
    name: "Signed Contract",
    characteristics: ["item"],
    text: "**FINE PRINT** Whenever an opponent plays a song, you may draw a card.",
    type: "item",
    abilities: [
        wheneverOpponentPlaysASong({
            name: "FINE PRINT",
            text: "Whenever an opponent plays a song, you may draw a card.",
            optional: true,
            effects: [drawACard],
        }),
    ],
    flavour: '"I Would love to help you, of course, but there\'s the little matter of the contract..."\n−Ursula',
    inkwell: true,
    colors: ["emerald"],
    cost: 2,
    illustrator: "Andrew Peka",
    number: 99,
    set: "URR",
    rarity: "uncommon",
};
const cardsInPlay = {
    type: "card",
    value: "all",
    filters: [{ filter: "zone", value: "play" }],
};
const damageCountersCannotBeRemovedAbility = {
    type: "static",
    ability: "effects",
    name: "TRAPPED!",
    text: "Damage counters can't be removed.",
    effects: [damageRemovalRestrictionEffect],
};
export const visionSlab = {
    id: "mir",
    name: "Vision Slab",
    characteristics: ["item"],
    text: "**DANGER REVEALED** At the start of your turn, if an opposing character has damage, gain 1 lore. \n\n\n**TRAPPED!** Damage counters can't be removed.",
    type: "item",
    abilities: [
        targetCardsGains({
            name: "TRAPPED!",
            text: "Damage counters can't be removed.",
            target: cardsInPlay,
            ability: damageCountersCannotBeRemovedAbility,
        }),
        atTheStartOfYourTurn({
            name: "Danger Revealed",
            text: "At the start of your turn, if an opposing character has damage, gain 1 lore.",
            conditions: [
                {
                    type: "filter",
                    comparison: { operator: "gte", value: 1 },
                    filters: [
                        { filter: "type", value: "character" },
                        { filter: "zone", value: "play" },
                        { filter: "owner", value: "opponent" },
                        { filter: "status", value: "damaged" },
                    ],
                },
            ],
            effects: [youGainLore(1)],
        }),
    ],
    flavour: "Tío Bruno! What's happening to him? We have to help!\n−Mirabel",
    inkwell: true,
    colors: ["emerald"],
    cost: 3,
    illustrator: "Jonas Petsuskas",
    number: 100,
    set: "URR",
    rarity: "uncommon",
};
export const imperialProclamation = {
    id: "vlv",
    name: "Imperial Proclamation",
    characteristics: ["item"],
    text: "**CALL TO THE FRONT** Whenever one of your characters challenges another character, you pay 1 {I} less for the next character you play this turn.",
    type: "item",
    abilities: [
        wheneverOneOfYourCharChallengesAnotherChar({
            name: "Call To The Front",
            text: "Whenever one of your characters challenges another character, you pay 1 {I} less for the next character you play this turn.",
            effects: [youPayXLessToPlayNextCharThisTurn(1)],
        }),
    ],
    flavour: "By order of the Emperor, one man from every family must server in the Imperial Army\n−Chi Fu",
    inkwell: true,
    colors: ["ruby"],
    cost: 1,
    illustrator: "Devin Yang",
    number: 131,
    set: "URR",
    rarity: "rare",
};
export const medallionWeights = {
    id: "xo1",
    name: "Medallion Weights",
    characteristics: ["item"],
    text: "**DISCIPLINE AND STRENGTH** {E}, 2 {I} - Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.",
    type: "item",
    abilities: [
        {
            type: "activated",
            name: "Discipline And Strength",
            costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
            text: "{E}, 2 {I} - Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.",
            effects: [
                {
                    type: "attribute",
                    attribute: "strength",
                    amount: 2,
                    modifier: "add",
                    duration: "turn",
                    target: chosenCharacter,
                },
                {
                    type: "ability",
                    ability: "custom",
                    modifier: "add",
                    duration: "turn",
                    target: chosenCharacter,
                    customAbility: wheneverChallengesAnotherChar({
                        name: "Discipline And Strength",
                        text: "Whenever they challenge another character this turn, you may draw a card.",
                        optional: true,
                        effects: [drawACard],
                    }),
                },
            ],
        },
    ],
    inkwell: true,
    colors: ["ruby"],
    cost: 2,
    illustrator: "Defne Tōzūm",
    number: 132,
    set: "URR",
    rarity: "uncommon",
};
export const thePlank = {
    id: "xh7",
    name: "The Plank",
    characteristics: ["item"],
    text: "**WALK!** 2 {I}, Banish this item - Choose one:\n· Banish chosen Hero character.\n· Ready chosen Villain character. They can't quest for the rest of this turn.",
    type: "item",
    abilities: [
        {
            name: "WALK!",
            type: "activated",
            text: "2 {I}, Banish this item - Choose one:\n· Banish chosen Hero character.\n· Ready chosen Villain character. They can't quest for the rest of this turn.",
            costs: [{ type: "banish" }, { type: "ink", amount: 2 }],
            effects: [
                {
                    type: "modal",
                    target: chosenCharacter,
                    modes: [
                        {
                            id: "1",
                            text: "Banish chosen Hero character.",
                            effects: [
                                {
                                    type: "banish",
                                    target: {
                                        type: "card",
                                        value: 1,
                                        filters: [
                                            { filter: "type", value: "character" },
                                            { filter: "zone", value: "play" },
                                            { filter: "characteristics", value: ["hero"] },
                                        ],
                                    },
                                },
                            ],
                        },
                        {
                            id: "2",
                            text: "Ready chosen Villain character. They can't quest for the rest of this turn.",
                            effects: [
                                ...readyAndCantQuest({
                                    type: "card",
                                    value: 1,
                                    filters: [
                                        { filter: "type", value: "character" },
                                        { filter: "zone", value: "play" },
                                        { filter: "characteristics", value: ["villain"] },
                                    ],
                                }),
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    flavour: "It's a once-in-a-lifetime view.",
    colors: ["ruby"],
    cost: 3,
    illustrator: "Roberto Gatto",
    number: 133,
    set: "URR",
    rarity: "common",
};
export const vitalisphere = {
    id: "x1o",
    name: "Vitalisphere",
    characteristics: ["item"],
    text: "**EXTRACT OF RUBY** 1 {I}, Banish this item - Chosen character gains **Rush** and gets +2 {S} this turn. _(They can challenge the turn they're played.)_",
    type: "item",
    abilities: [
        {
            type: "activated",
            name: "Extract of Ruby",
            text: "1 {I}, Banish this item - Chosen character gains **Rush** and gets +2 {S} this turn. _(They can challenge the turn they're played.)_",
            costs: [{ type: "ink", amount: 1 }, { type: "banish" }],
            effects: [
                {
                    type: "ability",
                    ability: "rush",
                    modifier: "add",
                    duration: "turn",
                    target: {
                        type: "card",
                        value: 1,
                        filters: [
                            {
                                filter: "owner",
                                value: "self",
                            },
                            {
                                filter: "type",
                                value: "character",
                            },
                            { filter: "zone", value: "play" },
                        ],
                    },
                },
                {
                    type: "attribute",
                    modifier: "add",
                    attribute: "strength",
                    amount: 2,
                    target: {
                        type: "card",
                        value: 1,
                        filters: [
                            {
                                filter: "owner",
                                value: "self",
                            },
                            {
                                filter: "type",
                                value: "character",
                            },
                            { filter: "zone", value: "play" },
                        ],
                    },
                },
            ],
        },
    ],
    inkwell: true,
    colors: ["ruby"],
    cost: 1,
    illustrator: "Sandara Tang",
    number: 134,
    set: "URR",
    rarity: "common",
};
export const fieldOfIce = {
    id: "r97",
    missingTestCase: true,
    name: "Field of Ice",
    characteristics: ["item"],
    text: "**ICY DEFENSE** Whenever you play a character, they gain **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
    type: "item",
    abilities: [
        wheneverYouPlayACharacter({
            name: "Icy Defense",
            text: "Whenever you play a character, they gain **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
            effects: [
                {
                    type: "ability",
                    ability: "resist",
                    modifier: "add",
                    amount: 1,
                    duration: "next_turn",
                    until: true,
                    target: chosenCharacter,
                },
            ],
        }),
    ],
    inkwell: true,
    colors: ["sapphire"],
    cost: 3,
    illustrator: "Mariana Moreno",
    number: 166,
    set: "URR",
    rarity: "rare",
};
export const greatStoneDragon = {
    id: "jbi",
    name: "Great Stone Dragon",
    characteristics: ["item"],
    text: "**ASLEEP** This item enters play exerted.\n\n\n**AWAKEN** {E}- Put a character card from your discard into your inkwell facedown and exerted.",
    type: "item",
    abilities: [
        {
            type: "resolution",
            name: "ASLEEP",
            text: "This item enters play exerted.",
            effects: [
                {
                    type: "exert",
                    exert: true,
                    target: {
                        type: "card",
                        value: 1,
                        filters: [
                            {
                                filter: "source",
                                value: "self",
                            },
                        ],
                    },
                },
            ],
        },
        {
            type: "activated",
            name: "AWAKEN",
            text: "{E}- Put a character card from your discard into your inkwell facedown and exerted.",
            costs: [{ type: "exert" }],
            effects: [
                {
                    type: "move",
                    exerted: true,
                    to: "inkwell",
                    target: {
                        type: "card",
                        value: 1,
                        filters: [
                            {
                                filter: "zone",
                                value: "discard",
                            },
                            {
                                filter: "type",
                                value: "character",
                            },
                            {
                                filter: "owner",
                                value: "self",
                            },
                        ],
                    },
                },
            ],
        },
    ],
    inkwell: true,
    colors: ["sapphire"],
    cost: 3,
    illustrator: "Ryan Bittner",
    number: 167,
    set: "URR",
    rarity: "uncommon",
};
export const iceBlock = {
    id: "i2i",
    missingTestCase: true,
    name: "Ice Block",
    characteristics: ["item"],
    text: "**CHILLY LABOR** {E} − Chosen character gets -1 {S} this turn.",
    type: "item",
    abilities: [
        {
            type: "activated",
            costs: [{ type: "exert" }],
            name: "Chilly Labor",
            text: "{E} − Chosen character gets -1 {S} this turn.",
            effects: [
                {
                    type: "attribute",
                    attribute: "strength",
                    amount: 1,
                    modifier: "subtract",
                    target: chosenCharacter,
                },
            ],
        },
    ],
    flavour: "Frozen ink can be harvested and processed to many useful ends.",
    colors: ["sapphire"],
    cost: 1,
    illustrator: "Gregor Krysinski",
    number: 168,
    set: "URR",
    rarity: "common",
};
export const fortisphere = {
    id: "id0",
    name: "Fortisphere",
    characteristics: ["item"],
    text: "**RESOURCEFUL** When you play this item, you may draw a card.\n\n\n**EXTRACT OF STEEL** 1 {I}, Banish this item - Chosen character of yours gains **Bodyguard** until the start of your next turn. _(An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
    type: "item",
    abilities: [
        {
            ...whenYouPlayMayDrawACard,
            name: "RESOURCEFUL",
            text: "**RESOURCEFUL** When you play this item, you may draw a card.",
        },
        {
            type: "activated",
            name: "EXTRACT OF STEEL",
            text: "1 {I}, Banish this item - Chosen character of yours gains **Bodyguard** until the start of your next turn. _(An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
            costs: [{ type: "ink", amount: 1 }, { type: "banish" }],
            effects: [
                {
                    type: "ability",
                    ability: "bodyguard",
                    modifier: "add",
                    duration: "next_turn",
                    until: true,
                    target: chosenCharacter,
                },
            ],
        },
    ],
    inkwell: true,
    colors: ["steel"],
    cost: 1,
    illustrator: "Mariana Moreno Ayala",
    number: 200,
    set: "URR",
    rarity: "common",
};
export const imperialBow = {
    id: "mcd",
    missingTestCase: true,
    name: "Imperial Bow",
    characteristics: ["item"],
    text: "**WITHIN RANGE** {E}, 1 {I} − Chosen Hero character gains **Challenger** +2 and **Evasive** this turn. _(They get +2 {S} while challenging. They can challenge characters with Evasive.)_",
    type: "item",
    abilities: [
        {
            type: "activated",
            name: "Within Range",
            text: "{E}, 1 {I} − Chosen Hero character gains **Challenger** +2 and **Evasive** this turn. _(They get +2 {S} while challenging. They can challenge characters with Evasive.)_",
            costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
            effects: [
                {
                    type: "ability",
                    ability: "challenger",
                    amount: 2,
                    modifier: "add",
                    duration: "turn",
                    target: chosenHeroCharacter,
                },
                {
                    type: "ability",
                    ability: "evasive",
                    modifier: "add",
                    duration: "turn",
                    target: chosenHeroCharacter,
                },
            ],
        },
    ],
    inkwell: true,
    colors: ["steel"],
    cost: 2,
    illustrator: "Yari Lute",
    number: 201,
    set: "URR",
    rarity: "uncommon",
};
export const rlsLegacysCannon = {
    id: "etn",
    missingTestCase: true,
    name: "RLS Legacy's Cannon",
    characteristics: ["item"],
    text: "**BA-BOOM!** {E}, 2 {I}, Discard a card - Deal 2 damage to chosen character or location.",
    type: "item",
    abilities: [
        {
            type: "activated",
            name: "BA-BOOM!",
            costs: [
                { type: "exert" },
                {
                    type: "ink",
                    amount: 2,
                },
                {
                    type: "card",
                    amount: 1,
                    action: "discard",
                    filters: [
                        { filter: "owner", value: "self" },
                        { filter: "zone", value: "hand" },
                    ],
                },
            ],
            text: "{E}, 2 {I}, Discard a card - Deal 2 damage to chosen character or location.",
            effects: [
                {
                    type: "damage",
                    amount: 2,
                    target: chosenCharacterOrLocation,
                },
            ],
        },
    ],
    flavour: "So help me, I'll use the ship's cannons to blast ya all to kingdom come!\n−John Silver",
    colors: ["steel"],
    cost: 3,
    illustrator: "Luigi Aime",
    number: 202,
    set: "URR",
    rarity: "rare",
};
//# sourceMappingURL=items.js.map