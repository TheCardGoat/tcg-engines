import type { CharacterCard } from "@tcg/lorcana-types";

export const princeAchmedRivalSuitor: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "exert",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      id: "148-1",
      name: "UNWELCOME PROPOSAL",
      text: "UNWELCOME PROPOSAL When you play this character, you may exert chosen Princess character.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 184,
  cardType: "character",
  classifications: ["Storyborn", "Prince"],
  cost: 2,
  externalIds: {
    ravensburger: "91094608fd69311fa696ac4e5dd0c37e72dd3e24",
  },
  franchise: "Aladdin",
  fullName: "Prince Achmed - Rival Suitor",
  id: "148",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Prince Achmed",
  set: "008",
  strength: 2,
  text: "UNWELCOME PROPOSAL When you play this character, you may exert chosen Princess character.",
  version: "Rival Suitor",
  willpower: 2,
};
