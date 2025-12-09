import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
export const bagheeraGuardianJaguar = {
    id: "dnh",
    name: "Bagheera",
    title: "Guardian Jaguar",
    characteristics: ["storyborn", "ally"],
    text: "Bodyguard \nYOU MUST BE BRAVE When this character is banished during an opponent's turn, deal 2 damage to each opposing character.",
    type: "character",
    abilities: [
        bodyguardAbility,
        whenThisCharacterBanished({
            conditions: [{ type: "during-turn", value: "opponent" }],
            name: "You must be brave",
            text: "When this character is banished during an opponent's turn, deal 2 damage to each opposing character.",
            effects: [
                dealDamageEffect(2, {
                    type: "card",
                    value: "all",
                    filters: [
                        {
                            filter: "owner",
                            value: "opponent",
                        },
                        { filter: "zone", value: "play" },
                        { filter: "type", value: "character" },
                    ],
                }),
            ],
        }),
    ],
    inkwell: true,
    colors: ["steel"],
    cost: 5,
    strength: 4,
    willpower: 3,
    illustrator: "Alice Pisoni",
    number: 198,
    set: "007",
    rarity: "legendary",
    lore: 2,
};
//# sourceMappingURL=bagheeraGuardianJaguar.js.map