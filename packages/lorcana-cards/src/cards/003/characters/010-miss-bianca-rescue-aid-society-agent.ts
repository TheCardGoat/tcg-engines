import type { CharacterCard } from "@tcg/lorcana";

export const missBiancaRescueAidSocietyAgent: CharacterCard = {
  id: "113",
  cardType: "character",
  name: "Miss Bianca",
  version: "Rescue Aid Society Agent",
  fullName: "Miss Bianca - Rescue Aid Society Agent",
  inkType: ["amber"],
  franchise: "Rescuers",
  set: "003",
  text: "Singer 4 (This character counts as cost 4 to sing songs.)",
  cardNumber: "010",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "856f8987d811850242fd68b59881b2c78568dc0a",
  },
  keywords: [
    {
      type: "Singer",
      value: 4,
    },
  ],
  abilities: [
    {
      id: "113-ability-1",
      text: "Singer 4 (This character counts as cost 4 to sing songs.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
