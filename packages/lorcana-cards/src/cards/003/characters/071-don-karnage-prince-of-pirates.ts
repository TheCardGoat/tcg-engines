import type { CharacterCard } from "@tcg/lorcana-types";

export const donKarnagePrinceOfPirates: CharacterCard = {
  id: "a8q",
  cardType: "character",
  name: "Don Karnage",
  version: "Prince of Pirates",
  fullName: "Don Karnage - Prince of Pirates",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "003",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 71,
  inkable: true,
  externalIds: {
    ravensburger: "24ea5904a2f26342b5785ee8bc9953780df09477",
  },
  abilities: [
    {
      id: "a8q-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Prince", "Pirate"],
};
