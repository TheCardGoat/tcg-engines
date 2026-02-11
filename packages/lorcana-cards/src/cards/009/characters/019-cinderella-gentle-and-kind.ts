import type { CharacterCard } from "@tcg/lorcana-types";

export const cinderellaGentleAndKind: CharacterCard = {
  abilities: [
    {
      id: "14u-1",
      keyword: "Singer",
      text: "Singer 5",
      type: "keyword",
      value: 5,
    },
    {
      cost: { exert: true },
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
      id: "14u-2",
      text: "A WONDERFUL DREAM {E} — Remove up to 3 damage from chosen Princess character.",
      type: "activated",
    },
  ],
  cardNumber: 19,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "933453208f4cab4b5eacd5391db6a6cf95b7e691",
  },
  franchise: "Cinderella",
  fullName: "Cinderella - Gentle and Kind",
  id: "14u",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Cinderella",
  set: "009",
  strength: 2,
  text: "Singer 5 (This character counts as cost 5 to sing songs.)\nA WONDERFUL DREAM {E} — Remove up to 3 damage from chosen Princess character.",
  version: "Gentle and Kind",
  willpower: 5,
};
