import type { CharacterCard } from "@tcg/lorcana-types";

export const cinderellaGentleAndKind: CharacterCard = {
  id: "14u",
  cardType: "character",
  name: "Cinderella",
  version: "Gentle and Kind",
  fullName: "Cinderella - Gentle and Kind",
  inkType: ["amber"],
  franchise: "Cinderella",
  set: "009",
  text: "Singer 5 (This character counts as cost 5 to sing songs.)\nA WONDERFUL DREAM {E} — Remove up to 3 damage from chosen Princess character.",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  cardNumber: 19,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "933453208f4cab4b5eacd5391db6a6cf95b7e691",
  },
  abilities: [
    {
      id: "14u-1",
      type: "keyword",
      keyword: "Singer",
      value: 5,
      text: "Singer 5",
    },
    {
      id: "14u-2",
      type: "activated",
      effect: {
        type: "remove-damage",
        amount: 3,
        upTo: true,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "A WONDERFUL DREAM {E} — Remove up to 3 damage from chosen Princess character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
