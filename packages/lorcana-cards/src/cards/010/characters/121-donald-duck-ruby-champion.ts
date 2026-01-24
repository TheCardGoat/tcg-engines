import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckRubyChampion: CharacterCard = {
  id: "10w",
  cardType: "character",
  name: "Donald Duck",
  version: "Ruby Champion",
  fullName: "Donald Duck - Ruby Champion",
  inkType: ["ruby"],
  set: "010",
  text: "HIGH ENERGY Your other Ruby characters get +1 {S}.\nPOWERFUL REWARD Your other Ruby characters with 7 {S} or more get +1 {L}.",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  cardNumber: 121,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "850bd5ec2e325a93ef18b43b0a1491375105b5f1",
  },
  abilities: [
    {
      id: "10w-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
      },
      name: "HIGH ENERGY Your other Ruby",
      text: "HIGH ENERGY Your other Ruby characters get +1 {S}.",
    },
    {
      id: "10w-2",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
      },
      text: "POWERFUL REWARD Your other Ruby characters with 7 {S} or more get +1 {L}.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
