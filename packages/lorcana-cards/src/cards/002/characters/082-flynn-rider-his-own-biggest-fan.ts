import type { CharacterCard } from "@tcg/lorcana-types";

export const flynnRiderHisOwnBiggestFan: CharacterCard = {
  id: "11r",
  cardType: "character",
  name: "Flynn Rider",
  version: "His Own Biggest Fan",
  fullName: "Flynn Rider - His Own Biggest Fan",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "002",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Flynn Rider.)\nEvasive (Only characters with Evasive can challenge this character.)\nONE LAST, BIG SCORE This character gets -1 {L} for each card in your opponents' hands.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 4,
  cardNumber: 82,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "8812a7f3b2b166bdddc6961bfc5a2b1a783b1d51",
  },
  abilities: [
    {
      id: "11r-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 2,
      },
      text: "Shift 2",
    },
    {
      id: "11r-2",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "11r-3",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: -1,
        target: "SELF",
      },
      text: "ONE LAST, BIG SCORE This character gets -1 {L} for each card in your opponents' hands.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Prince"],
};
