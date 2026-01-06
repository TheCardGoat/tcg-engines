import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseBraveLittlePrince: CharacterCard = {
  id: "cbw",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Brave Little Prince",
  fullName: "Mickey Mouse - Brave Little Prince",
  inkType: ["ruby"],
  set: "009",
  text: "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Mickey Mouse.)\nEvasive (Only characters with Evasive can challenge this character.)\nCROWNING ACHIEVEMENT While this character has a card under him, he gets +3 {S}, +3 {W}, and +3 {L}.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 111,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2c70fa049317778d3977506d8e340d662264a843",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Prince"],
};
