import type { CharacterCard } from "@tcg/lorcana-types";

export const princeAchmedRivalSuitor: CharacterCard = {
  id: "148",
  cardType: "character",
  name: "Prince Achmed",
  version: "Rival Suitor",
  fullName: "Prince Achmed - Rival Suitor",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "008",
  text: "UNWELCOME PROPOSAL When you play this character, you may exert chosen Princess character.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 184,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "91094608fd69311fa696ac4e5dd0c37e72dd3e24",
  },
  abilities: [
    {
      id: "148-1",
      type: "triggered",
      name: "UNWELCOME PROPOSAL",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
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
      text: "UNWELCOME PROPOSAL When you play this character, you may exert chosen Princess character.",
    },
  ],
  classifications: ["Storyborn", "Prince"],
};
