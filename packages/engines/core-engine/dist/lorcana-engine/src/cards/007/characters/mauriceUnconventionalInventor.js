import { chosenItemOfYours } from "@lorcanito/lorcana-engine/abilities/target";
import { chosenCharacterWithStrengthXorLess } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { drawACard, mayBanish, } from "@lorcanito/lorcana-engine/effects/effects";
const afterEffect = {
    type: "create-layer-based-on-target",
    effects: [mayBanish(chosenCharacterWithStrengthXorLess(2))],
    target: {
        type: "card",
        value: 1,
        filters: [
            { filter: "type", value: "item" },
            { filter: "owner", value: "self" },
            {
                filter: "attribute",
                value: "name",
                comparison: { operator: "eq", value: "maurice's machine" },
            },
        ],
    },
};
const targetingMauricesMachine = {
    type: "banish",
    target: {
        type: "card",
        value: 1,
        filters: [
            { filter: "type", value: "item" },
            { filter: "owner", value: "self" },
            {
                filter: "attribute",
                value: "name",
                comparison: { operator: "eq", value: "maurice's machine" },
            },
        ],
    },
    forEach: [drawACard],
    afterEffect: [afterEffect],
};
const notTargettingMauricesMachine = {
    type: "banish",
    target: chosenItemOfYours,
    forEach: [drawACard],
};
const newVar = {
    type: "target-conditional",
    // move condition to a separate object, so the filter is the same
    effects: [targetingMauricesMachine],
    fallback: [notTargettingMauricesMachine],
    // TODO: Re implement conditional target
    target: {
        type: "card",
        value: 1,
        filters: [
            { filter: "type", value: "item" },
            { filter: "owner", value: "self" },
            {
                filter: "attribute",
                value: "name",
                comparison: { operator: "eq", value: "maurice's machine" },
            },
        ],
    },
};
export const mauriceUnconventionalInventor = {
    id: "mgt",
    name: "Maurice",
    title: "Unconventional Inventor",
    characteristics: ["storyborn", "mentor", "inventor"],
    type: "character",
    inkwell: true,
    colors: ["ruby"],
    cost: 4,
    strength: 5,
    willpower: 2,
    illustrator: "Andy Estrada / Greg Shrader",
    number: 138,
    set: "007",
    rarity: "rare",
    lore: 1,
    text: "HOW ON EARTH DID THAT HAPPEN? When you play this character, you may banish chosen item of yours to draw a card. If the banished item is named Maurice’s Machine, you may also banish chosen character with 2 {S} or less.",
    abilities: [
        whenYouPlayThisCharacter({
            name: "How on Earth Did That Happen?",
            text: "When you play this character, you may banish chosen item of yours to draw a card. If the banished item is named Maurice’s Machine, you may also banish chosen character with 2 {S} or less.",
            optional: true,
            dependentEffects: true,
            effects: [newVar],
        }),
    ],
};
//# sourceMappingURL=mauriceUnconventionalInventor.js.map