import type { CharacterCard } from "@tcg/lorcana-types";

export const magicBroomSwiftCleaner: CharacterCard = {
  abilities: [
    {
      id: "114-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          intoDeck: "owner",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["card"],
          },
          type: "shuffle-into-deck",
        },
        type: "optional",
      },
      id: "114-2",
      text: "CLEAN THIS, CLEAN THAT When you play this character, you may shuffle all Broom cards from your discard into your deck.",
      type: "action",
    },
  ],
  cardNumber: 45,
  cardType: "character",
  classifications: ["Dreamborn", "Broom"],
  cost: 5,
  externalIds: {
    ravensburger: "869358d9f809656d6013e88df0dee2b50724aab8",
  },
  franchise: "Fantasia",
  fullName: "Magic Broom - Swift Cleaner",
  id: "114",
  inkType: ["amethyst"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Magic Broom",
  set: "003",
  strength: 4,
  text: "Rush (This character can challenge the turn they're played.)\nCLEAN THIS, CLEAN THAT When you play this character, you may shuffle all Broom cards from your discard into your deck.",
  version: "Swift Cleaner",
  willpower: 4,
};
