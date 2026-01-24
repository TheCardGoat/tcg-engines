import type { CharacterCard } from "@tcg/lorcana-types";

export const sisuUnitingDragon: CharacterCard = {
  id: "ojg",
  cardType: "character",
  name: "Sisu",
  version: "Uniting Dragon",
  fullName: "Sisu - Uniting Dragon",
  inkType: ["amethyst"],
  franchise: "Raya and the Last Dragon",
  set: "006",
  text: "TRUST BUILDS TRUST Whenever this character quests, reveal the top card of your deck. If it’s a Dragon character card, put it into your hand and repeat this effect. Otherwise, put it on either the top or the bottom of your deck.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 54,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "587243dff13c71d2996bab2b8c17b82e1f0179ae",
  },
  abilities: [
    {
      id: "ojg-1",
      type: "triggered",
      name: "TRUST BUILDS TRUST",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "it’s a Dragon character card",
        },
        then: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
      },
      text: "TRUST BUILDS TRUST Whenever this character quests, reveal the top card of your deck. If it’s a Dragon character card, put it into your hand and repeat this effect. Otherwise, put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Deity", "Dragon"],
};
