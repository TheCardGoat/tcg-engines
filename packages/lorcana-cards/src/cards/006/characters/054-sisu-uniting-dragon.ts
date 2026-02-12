import type { CharacterCard } from "@tcg/lorcana-types";

export const sisuUnitingDragon: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "it’s a Dragon character card",
        },
        then: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        type: "conditional",
      },
      id: "ojg-1",
      name: "TRUST BUILDS TRUST",
      text: "TRUST BUILDS TRUST Whenever this character quests, reveal the top card of your deck. If it’s a Dragon character card, put it into your hand and repeat this effect. Otherwise, put it on either the top or the bottom of your deck.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 54,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Deity", "Dragon"],
  cost: 4,
  externalIds: {
    ravensburger: "587243dff13c71d2996bab2b8c17b82e1f0179ae",
  },
  franchise: "Raya and the Last Dragon",
  fullName: "Sisu - Uniting Dragon",
  id: "ojg",
  inkType: ["amethyst"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Sisu",
  set: "006",
  strength: 3,
  text: "TRUST BUILDS TRUST Whenever this character quests, reveal the top card of your deck. If it’s a Dragon character card, put it into your hand and repeat this effect. Otherwise, put it on either the top or the bottom of your deck.",
  version: "Uniting Dragon",
  willpower: 3,
};
