import type { CharacterCard } from "@tcg/lorcana-types";

export const magicBroomIlluminaryKeeper: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "self",
            zones: ["play"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "1ct-1",
      name: "NICE AND TIDY",
      text: "NICE AND TIDY Whenever you play another character, you may banish this character to draw a card.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 48,
  cardType: "character",
  classifications: ["Dreamborn", "Broom"],
  cost: 1,
  externalIds: {
    ravensburger: "aff7e808c09b68f3e297df1e5cd256f7f646571d",
  },
  franchise: "Fantasia",
  fullName: "Magic Broom - Illuminary Keeper",
  id: "1ct",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Magic Broom",
  set: "004",
  strength: 1,
  text: "NICE AND TIDY Whenever you play another character, you may banish this character to draw a card.",
  version: "Illuminary Keeper",
  willpower: 2,
};
