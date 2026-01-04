import type { CharacterCard } from "@tcg/lorcana-types";

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
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 10,
  inkable: true,
  externalIds: {
    ravensburger: "856f8987d811850242fd68b59881b2c78568dc0a",
  },
  abilities: [
    {
      id: "113-1",
      text: "Singer +4",
      type: "keyword",
      keyword: "Singer",
      value: 4,
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
