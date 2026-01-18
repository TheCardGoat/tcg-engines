import type { CharacterCard } from "@tcg/lorcana-types";

export const chernabogEvildoer: CharacterCard = {
  id: "r3g",
  cardType: "character",
  name: "Chernabog",
  version: "Evildoer",
  fullName: "Chernabog - Evildoer",
  inkType: ["amber"],
  franchise: "Fantasia",
  set: "003",
  text: "THE POWER OF EVIL For each character card in your discard, you pay 1 {I} less to play this character.\nSUMMON THE SPIRITS When you play this character, shuffle all character cards from your discard into your deck.",
  cost: 10,
  strength: 9,
  willpower: 9,
  lore: 3,
  cardNumber: 3,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "61a80f2f88c8834ee4e9f7ab5c36239495197b09",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};
