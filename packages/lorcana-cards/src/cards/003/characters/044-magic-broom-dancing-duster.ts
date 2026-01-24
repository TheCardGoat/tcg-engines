import type { CharacterCard } from "@tcg/lorcana-types";

export const magicBroomDancingDuster: CharacterCard = {
  id: "1k5",
  cardType: "character",
  name: "Magic Broom",
  version: "Dancing Duster",
  fullName: "Magic Broom - Dancing Duster",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "003",
  text: "POWER CLEAN When you play this character, if you have a Sorcerer character in play, you may exert chosen opposing character. They can't ready at the start of their next turn.",
  cost: 6,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 44,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "cb2138848bcc8eaa3b83ee763a9e79f2de568321",
  },
  abilities: [
    {
      id: "1k5-1",
      type: "triggered",
      name: "POWER CLEAN",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a Sorcerer character in play",
        },
        then: {
          type: "restriction",
          restriction: "cant-ready",
          target: "SELF",
          duration: "their-next-turn",
        },
      },
      text: "POWER CLEAN When you play this character, if you have a Sorcerer character in play, you may exert chosen opposing character. They can't ready at the start of their next turn.",
    },
  ],
  classifications: ["Dreamborn", "Broom"],
};
