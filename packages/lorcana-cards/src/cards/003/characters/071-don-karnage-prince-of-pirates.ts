import type { CharacterCard } from "@tcg/lorcana";

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
  cardNumber: "071",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    ravensburger: "24ea5904a2f26342b5785ee8bc9953780df09477",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "a8qa1",
      text: "Evasive",
      type: "static",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Prince", "Pirate"],
};
