import type { CharacterCard } from "@tcg/lorcana";

export const feliciaAlwaysHungry: CharacterCard = {
  id: "7iz",
  cardType: "character",
  name: "Felicia",
  version: "Always Hungry",
  fullName: "Felicia - Always Hungry",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "Reckless (This character can't quest and must challenge each turn if able.)",
  cardNumber: "107",
  cost: 1,
  strength: 3,
  willpower: 1,
  lore: 0,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "1b20de5f2b02e1b11d1cc8c4407911c249df3db3",
  },
  keywords: ["Reckless"],
  abilities: [
    {
      id: "7iz-ability-1",
      text: "Reckless (This character can't quest and must challenge each turn if able.)",
      type: "static",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
