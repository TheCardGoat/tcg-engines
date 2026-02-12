import type { CharacterCard } from "@tcg/lorcana-types";

export const flynnRiderHisOwnBiggestFan: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 2,
      },
      id: "11r-1",
      keyword: "Shift",
      text: "Shift 2",
      type: "keyword",
    },
    {
      id: "11r-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        modifier: -1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "11r-3",
      text: "ONE LAST, BIG SCORE This character gets -1 {L} for each card in your opponents' hands.",
      type: "action",
    },
  ],
  cardNumber: 82,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Prince"],
  cost: 4,
  externalIds: {
    ravensburger: "8812a7f3b2b166bdddc6961bfc5a2b1a783b1d51",
  },
  franchise: "Tangled",
  fullName: "Flynn Rider - His Own Biggest Fan",
  id: "11r",
  inkType: ["emerald"],
  inkable: false,
  lore: 4,
  missingTests: true,
  name: "Flynn Rider",
  set: "002",
  strength: 2,
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Flynn Rider.)\nEvasive (Only characters with Evasive can challenge this character.)\nONE LAST, BIG SCORE This character gets -1 {L} for each card in your opponents' hands.",
  version: "His Own Biggest Fan",
  willpower: 3,
};
