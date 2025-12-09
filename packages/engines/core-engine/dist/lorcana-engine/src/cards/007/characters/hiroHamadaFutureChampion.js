import { whenPlayOnThisCard } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
const shifter = [
    { filter: "owner", value: "self" },
    { filter: "type", value: "character" },
    { filter: "characteristics", value: ["floodborn"] },
];
const shifted = [
    { filter: "source", value: "self" },
];
export const hiroHamadaFutureChampion = {
    id: "mc6",
    name: "Hiro Hamada",
    title: "Future Champion",
    characteristics: ["storyborn", "hero", "inventor"],
    text: "ORIGIN STORY When you play a Floodborn character on this card, draw a card.",
    type: "character",
    abilities: [
        whenPlayOnThisCard({
            name: "ORIGIN STORY",
            text: "When you play a Floodborn character on this card, draw a card.",
            effects: [drawACard],
            shifterTargetFilters: shifter,
            shiftedTargetFilters: shifted,
        }),
    ],
    inkwell: true,
    colors: ["emerald"],
    cost: 3,
    strength: 3,
    willpower: 3,
    illustrator: "Jennifer Wu",
    number: 90,
    set: "007",
    rarity: "common",
    lore: 1,
};
//# sourceMappingURL=hiroHamadaFutureChampion.js.map