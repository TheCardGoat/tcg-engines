import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { wheneverYouReadyThisCharacter } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
export const boltSuperdog = {
    id: "zel",
    name: "Bolt",
    title: "Superdog",
    characteristics: ["floodborn", "hero"],
    text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Bolt.)\nMARK OF POWER Whenever you ready this character, gain 1 lore for each other undamaged character you have in play.\nBOLT STARE {E} – Banish chosen Illusion character.",
    type: "character",
    abilities: [
        shiftAbility(3, "bolt"),
        wheneverYouReadyThisCharacter({
            name: "MARK OF POWER",
            text: "Whenever you ready this character, gain 1 lore for each other undamaged character you have in play.",
            optional: true,
            unless: true,
            effects: [
                youGainLore({
                    dynamic: true,
                    filters: [
                        { filter: "zone", value: "play" },
                        {
                            filter: "status",
                            value: "damage",
                            comparison: { operator: "eq", value: 0 },
                        },
                        { filter: "owner", value: "self" },
                        { filter: "source", value: "other" },
                    ],
                }),
            ],
        }),
        {
            type: "activated",
            name: "BOLT STARE",
            text: "{E} – Banish chosen Illusion character.",
            costs: [{ type: "exert" }],
            effects: [
                {
                    type: "banish",
                    target: {
                        type: "card",
                        value: 1,
                        filters: [
                            { filter: "type", value: "character" },
                            { filter: "zone", value: "play" },
                            { filter: "owner", value: "opponent" },
                            { filter: "characteristics", value: ["illusion"] },
                        ],
                    },
                },
            ],
        },
    ],
    inkwell: true,
    // @ts-expect-error
    color: "",
    colors: ["amber", "steel"],
    cost: 5,
    strength: 3,
    willpower: 5,
    illustrator: "John Loren / Nicholas Kole",
    number: 4,
    set: "007",
    rarity: "super_rare",
    lore: 2,
};
//# sourceMappingURL=boltSuperdog.js.map