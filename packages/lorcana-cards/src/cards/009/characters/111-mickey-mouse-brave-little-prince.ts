import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseBraveLittlePrince: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "cbw-1",
      keyword: "Shift",
      text: "Shift 5 {I}",
      type: "keyword",
    },
    {
      id: "cbw-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: "SELF",
      },
      id: "cbw-3",
      text: "CROWNING ACHIEVEMENT While this character has a card under him, he gets +3 {S}, +3 {W}, and +3 {L}.",
      type: "static",
    },
  ],
  cardNumber: 111,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Prince"],
  cost: 3,
  externalIds: {
    ravensburger: "2c70fa049317778d3977506d8e340d662264a843",
  },
  fullName: "Mickey Mouse - Brave Little Prince",
  id: "cbw",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Mickey Mouse",
  set: "009",
  strength: 2,
  text: "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Mickey Mouse.)\nEvasive (Only characters with Evasive can challenge this character.)\nCROWNING ACHIEVEMENT While this character has a card under him, he gets +3 {S}, +3 {W}, and +3 {L}.",
  version: "Brave Little Prince",
  willpower: 2,
};
