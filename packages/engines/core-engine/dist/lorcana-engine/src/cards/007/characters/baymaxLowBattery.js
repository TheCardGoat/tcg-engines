import { entersPlayExerted } from "@lorcanito/lorcana-engine/effects/effects";
export const baymaxLowBattery = {
    id: "cm2",
    name: "Baymax",
    title: "Low Battery",
    characteristics: ["storyborn", "hero", "robot"],
    text: "SHHHHH This character enters play exerted.",
    type: "character",
    abilities: [
        entersPlayExerted({
            name: "SHHHHH",
        }),
    ],
    inkwell: true,
    colors: ["emerald"],
    cost: 2,
    strength: 3,
    willpower: 2,
    illustrator: "McKay Anderson",
    number: 87,
    set: "007",
    rarity: "common",
    lore: 2,
};
//# sourceMappingURL=baymaxLowBattery.js.map