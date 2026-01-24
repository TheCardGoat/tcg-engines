import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarTyrannicalHypnotist: CharacterCard = {
  id: "xg5",
  cardType: "character",
  name: "Jafar",
  version: "Tyrannical Hypnotist",
  fullName: "Jafar - Tyrannical Hypnotist",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "005",
  text: "Challenger +7 (While challenging, this character gets +7 {S}.)\nINTIMIDATING GAZE Opposing characters with cost 4 or less can't challenge.",
  cost: 6,
  strength: 0,
  willpower: 7,
  lore: 2,
  cardNumber: 172,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "788ce5ab348a5417b600e7c2902097c8a264500b",
  },
  abilities: [
    {
      id: "xg5-1",
      type: "keyword",
      keyword: "Challenger",
      value: 7,
      text: "Challenger +7",
    },
    {
      id: "xg5-2",
      type: "action",
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        target: "SELF",
      },
      text: "INTIMIDATING GAZE Opposing characters with cost 4 or less can't challenge.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
};
