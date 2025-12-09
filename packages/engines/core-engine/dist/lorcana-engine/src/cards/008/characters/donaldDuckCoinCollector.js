import { yourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
const gainAbilityEffect = {
    type: "ability",
    ability: "custom",
    modifier: "add",
    duration: "turn",
    target: yourCharacters,
    customAbility: {
        type: "activated",
        costs: [{ type: "exert" }],
        name: "MONEY EVERYWHERE",
        text: "{E} – Draw a card.",
        effects: [drawACard],
    },
};
export const moneyEverywhere = {
    type: "resolution",
    name: "MONEY EVERYWHERE",
    text: 'When you play this character, your other characters gain "{E} – Draw a card" this turn.',
    effects: [gainAbilityEffect],
};
const herePiggyPiggy = whenYouPlayThisForEachYouPayLess({
    name: "HERE, PIGGY, PIGGY",
    text: "For each item named The Nephews' Piggy Bank you have in play, you pay 2 {I} less to play this character.",
    amount: {
        dynamic: true,
        filterMultiplier: 2,
        filters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "play" },
            {
                filter: "attribute",
                value: "name",
                comparison: {
                    operator: "eq",
                    value: "The Nephews' Piggy Bank",
                },
            },
        ],
    },
});
export const donaldDuckCoinCollector = {
    id: "ojz",
    name: "Donald Duck",
    title: "Coin Collector",
    characteristics: ["storyborn", "hero"],
    text: 'HERE, PIGGY, PIGGY For each item named The Nephews\' Piggy Bank you have in play, you pay 2 {I} less to play this character.\nMONEY EVERYWHERE When you play this character, your other characters gain "{E} – Draw a card" this turn.',
    type: "character",
    abilities: [herePiggyPiggy, moneyEverywhere],
    inkwell: true,
    colors: ["amber"],
    cost: 8,
    strength: 4,
    willpower: 8,
    illustrator: "Rianit Hidayat",
    number: 37,
    set: "008",
    rarity: "super_rare",
    lore: 2,
};
//# sourceMappingURL=donaldDuckCoinCollector.js.map