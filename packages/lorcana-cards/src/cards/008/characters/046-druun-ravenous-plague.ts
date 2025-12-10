import type { CharacterCard } from "@tcg/lorcana";

export const druunRavenousPlague: CharacterCard = {
  id: "c4i",
  cardType: "character",
  name: "Druun",
  version: "Ravenous Plague",
  fullName: "Druun - Ravenous Plague",
  inkType: ["amethyst"],
  franchise: "Raya and the Last Dragon",
  set: "008",
  text: "Challenger +4 (While challenging, this character gets +4.)",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 1,
  cardNumber: 46,
  inkable: true,
  externalIds: {
    ravensburger: "2bb33b315b146bb97dcb0790b7c5819a986519d6",
  },
  abilities: [
    {
      id: "c4i-1",
      text: "Challenger +4",
      type: "keyword",
      keyword: "Challenger",
      value: 4,
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
