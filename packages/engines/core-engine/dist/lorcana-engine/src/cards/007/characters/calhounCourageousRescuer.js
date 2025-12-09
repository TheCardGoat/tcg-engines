import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
export const calhounCourageousRescuer = {
    id: "nan",
    name: "Calhoun",
    title: "Courageous Rescuer",
    characteristics: ["floodborn", "hero", "racer"],
    text: "Shift 4\nBACK TO START POSITIONS! Whenever this character challenges another character, you may return a Racer character card from your discard to your hand.",
    type: "character",
    abilities: [
        shiftAbility(4, "Calhoun"),
        wheneverChallengesAnotherChar({
            name: "BACK TO START POSITIONS!",
            text: "Whenever this character challenges another character, you may return a Racer character card from your discard to your hand.",
            effects: [
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
                            {
                                filter: "characteristics",
                                value: ["racer"],
                            },
                        ],
                    },
                },
            ],
        }),
    ],
    inkwell: true,
    // @ts-expect-error
    color: "",
    colors: ["amber", "ruby"],
    cost: 6,
    strength: 5,
    willpower: 5,
    illustrator: "Alice Pisoni",
    number: 26,
    set: "007",
    rarity: "rare",
    lore: 2,
};
//# sourceMappingURL=calhounCourageousRescuer.js.map