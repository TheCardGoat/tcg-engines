import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import { opponentLoseLore } from "@lorcanito/lorcana-engine/effects/effects";
export const theMatchmakerUnforgivingExpert = {
    id: "wmb",
    name: "The Matchmaker",
    title: "Unforgiving Expert",
    characteristics: ["storyborn"],
    text: "YOU ARE A DISGRACE! Whenever this character challenges another character, each opponent loses 1 lore.",
    type: "character",
    abilities: [
        wheneverChallengesAnotherChar({
            name: "You are a disgrace!",
            text: "Whenever this character challenges another character, each opponent loses 1 lore.",
            effects: [opponentLoseLore(1)],
        }),
    ],
    inkwell: true,
    colors: ["ruby"],
    cost: 4,
    strength: 4,
    willpower: 3,
    illustrator: "Brian Weiss",
    number: 123,
    set: "007",
    rarity: "common",
    lore: 1,
};
//# sourceMappingURL=theMatchmakerUnforgivingExpert.js.map