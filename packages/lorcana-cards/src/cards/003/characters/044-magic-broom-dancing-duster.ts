import type { CharacterCard } from "@tcg/lorcana-types";

export const magicBroomDancingDuster: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you have a Sorcerer character in play",
          type: "if",
        },
        then: {
          duration: "until-start-of-next-turn",
          restriction: "cant-ready",
          target: "SELF",
          type: "restriction",
        },
        type: "conditional",
      },
      id: "1k5-1",
      name: "POWER CLEAN",
      text: "POWER CLEAN When you play this character, if you have a Sorcerer character in play, you may exert chosen opposing character. They can't ready at the start of their next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 44,
  cardType: "character",
  classifications: ["Dreamborn", "Broom"],
  cost: 6,
  externalIds: {
    ravensburger: "cb2138848bcc8eaa3b83ee763a9e79f2de568321",
  },
  franchise: "Fantasia",
  fullName: "Magic Broom - Dancing Duster",
  id: "1k5",
  inkType: ["amethyst"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Magic Broom",
  set: "003",
  strength: 3,
  text: "POWER CLEAN When you play this character, if you have a Sorcerer character in play, you may exert chosen opposing character. They can't ready at the start of their next turn.",
  version: "Dancing Duster",
  willpower: 3,
};
