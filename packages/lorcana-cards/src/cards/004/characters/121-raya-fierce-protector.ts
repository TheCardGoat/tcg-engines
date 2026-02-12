import type { CharacterCard } from "@tcg/lorcana-types";

export const rayaFierceProtector: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "arj-1",
      name: "DON'T CROSS ME",
      text: "DON'T CROSS ME Whenever this character challenges another character, gain 1 lore for each other damaged character you have in play.",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 121,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 3,
  externalIds: {
    ravensburger: "26cc86f21b2d1246e0ad32b654c821192af603c0",
  },
  franchise: "Raya and the Last Dragon",
  fullName: "Raya - Fierce Protector",
  id: "arj",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Raya",
  set: "004",
  strength: 3,
  text: "DON'T CROSS ME Whenever this character challenges another character, gain 1 lore for each other damaged character you have in play.",
  version: "Fierce Protector",
  willpower: 3,
};
