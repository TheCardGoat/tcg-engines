import type { CharacterCard } from "@tcg/lorcana";

export const mrsBeakleyFormerShushAgent: CharacterCard = {
  id: "16m",
  cardType: "character",
  name: "Mrs. Beakley",
  version: "Former S.H.U.S.H. Agent",
  fullName: "Mrs. Beakley - Former S.H.U.S.H. Agent",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cardNumber: "011",
  cost: 4,
  strength: 2,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "99a7cb5afcf2f617bc3f2280c0afc300de76be91",
  },
  keywords: ["Bodyguard"],
  abilities: [
    {
      id: "16m-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
