import type { CharacterCard } from "@tcg/lorcana-types";

export const idunaCaringMother: CharacterCard = {
  abilities: [
    {
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
      id: "178-1",
      name: "ENDURING LOVE",
      text: "ENDURING LOVE When this character is banished, you may put this card into your inkwell facedown and exerted.",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 147,
  cardType: "character",
  classifications: ["Storyborn", "Mentor", "Queen"],
  cost: 4,
  externalIds: {
    ravensburger: "9bd57fcb99a507768c2ed76d095a7b67706581f7",
  },
  franchise: "Frozen",
  fullName: "Iduna - Caring Mother",
  id: "178",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Iduna",
  set: "004",
  strength: 3,
  text: "ENDURING LOVE When this character is banished, you may put this card into your inkwell facedown and exerted.",
  version: "Caring Mother",
  willpower: 3,
};
