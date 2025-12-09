import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
export const ratiganNefariousCriminal = {
    id: "kod",
    name: "Ratigan",
    title: "Nefarious Criminal",
    characteristics: ["storyborn", "villain"],
    text: "A MARVELOUS PERFORMANCE Whenever you play an action while this character is exerted, gain 1 lore.",
    type: "character",
    abilities: [
        wheneverPlays({
            name: "A MARVELOUS PERFORMANCE",
            text: "Whenever you play an action while this character is exerted, gain 1 lore.",
            conditions: [{ type: "exerted" }],
            triggerTarget: {
                type: "card",
                value: 1,
                filters: [
                    { filter: "type", value: "action" },
                    { filter: "characteristics", value: ["action"] },
                    { filter: "owner", value: "self" },
                ],
            },
            effects: [youGainLore(1)],
        }),
    ],
    inkwell: true,
    colors: ["ruby"],
    cost: 4,
    strength: 3,
    willpower: 3,
    illustrator: "Max Ulichney",
    number: 143,
    set: "007",
    rarity: "legendary",
    lore: 1,
};
//# sourceMappingURL=ratiganNefariousCriminal.js.map