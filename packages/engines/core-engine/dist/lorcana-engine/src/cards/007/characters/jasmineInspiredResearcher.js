import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import { drawXCards } from "@lorcanito/lorcana-engine/effects/effects";
export const jasmineInspiredResearcher = {
    id: "i0v",
    name: "Jasmine",
    title: "Inspired Researcher",
    characteristics: ["storyborn", "hero", "princess"],
    text: "EXTRA ASSISTANCE Whenever this character quests, if you have no cards in your hand, draw a card for each Ally character you have in play.",
    type: "character",
    abilities: [
        wheneverQuests({
            name: "EXTRA ASSISTANCE",
            text: "Whenever this character quests, if you have no cards in your hand, draw a card for each Ally character you have in play.",
            conditions: [
                {
                    type: "hand",
                    amount: 0,
                    player: "self",
                },
            ],
            effects: [
                drawXCards({
                    dynamic: true,
                    filters: [
                        { filter: "type", value: "character" },
                        { filter: "zone", value: "play" },
                        { filter: "owner", value: "self" },
                        { filter: "characteristics", value: ["ally"] },
                    ],
                }),
            ],
        }),
    ],
    inkwell: false,
    // @ts-expect-error
    color: "",
    colors: ["sapphire", "steel"],
    cost: 5,
    strength: 3,
    willpower: 5,
    illustrator: "Milica Celtikovic",
    number: 173,
    set: "007",
    rarity: "rare",
    lore: 2,
};
//# sourceMappingURL=jasmineInspiredResearcher.js.map