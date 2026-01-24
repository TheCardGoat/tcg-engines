import type { CharacterCard } from "@tcg/lorcana-types";

export const idunaCaringMother: CharacterCard = {
  id: "178",
  cardType: "character",
  name: "Iduna",
  version: "Caring Mother",
  fullName: "Iduna - Caring Mother",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "004",
  text: "ENDURING LOVE When this character is banished, you may put this card into your inkwell facedown and exerted.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 147,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9bd57fcb99a507768c2ed76d095a7b67706581f7",
  },
  abilities: [
    {
      id: "178-1",
      type: "triggered",
      name: "ENDURING LOVE",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "this-card",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        chooser: "CONTROLLER",
      },
      text: "ENDURING LOVE When this character is banished, you may put this card into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Queen"],
};
