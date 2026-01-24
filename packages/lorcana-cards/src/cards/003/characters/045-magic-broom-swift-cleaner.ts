import type { CharacterCard } from "@tcg/lorcana-types";

export const magicBroomSwiftCleaner: CharacterCard = {
  id: "114",
  cardType: "character",
  name: "Magic Broom",
  version: "Swift Cleaner",
  fullName: "Magic Broom - Swift Cleaner",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "003",
  text: "Rush (This character can challenge the turn they're played.)\nCLEAN THIS, CLEAN THAT When you play this character, you may shuffle all Broom cards from your discard into your deck.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 45,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "869358d9f809656d6013e88df0dee2b50724aab8",
  },
  abilities: [
    {
      id: "114-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
    {
      id: "114-2",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "shuffle-into-deck",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["card"],
          },
          intoDeck: "owner",
        },
        chooser: "CONTROLLER",
      },
      text: "CLEAN THIS, CLEAN THAT When you play this character, you may shuffle all Broom cards from your discard into your deck.",
    },
  ],
  classifications: ["Dreamborn", "Broom"],
};
