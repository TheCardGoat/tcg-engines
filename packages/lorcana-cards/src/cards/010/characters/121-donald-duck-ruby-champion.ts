import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckRubyChampion: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "10w-1",
      name: "HIGH ENERGY Your other Ruby",
      text: "HIGH ENERGY Your other Ruby characters get +1 {S}.",
      type: "static",
    },
    {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "10w-2",
      text: "POWERFUL REWARD Your other Ruby characters with 7 {S} or more get +1 {L}.",
      type: "action",
    },
  ],
  cardNumber: 121,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "850bd5ec2e325a93ef18b43b0a1491375105b5f1",
  },
  fullName: "Donald Duck - Ruby Champion",
  id: "10w",
  inkType: ["ruby"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Donald Duck",
  set: "010",
  strength: 4,
  text: "HIGH ENERGY Your other Ruby characters get +1 {S}.\nPOWERFUL REWARD Your other Ruby characters with 7 {S} or more get +1 {L}.",
  version: "Ruby Champion",
  willpower: 4,
};
