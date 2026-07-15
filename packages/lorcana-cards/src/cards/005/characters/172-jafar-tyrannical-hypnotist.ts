import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarTyrannicalHypnotist: CharacterCard = {
  abilities: [
    {
      id: "xg5-1",
      keyword: "Challenger",
      text: "Challenger +7",
      type: "keyword",
      value: 7,
    },
    {
      effect: {
        restriction: "cant-challenge",
        target: "SELF",
        type: "restriction",
      },
      id: "xg5-2",
      text: "INTIMIDATING GAZE Opposing characters with cost 4 or less can't challenge.",
      type: "action",
    },
  ],
  cardNumber: 172,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  cost: 6,
  externalIds: {
    ravensburger: "788ce5ab348a5417b600e7c2902097c8a264500b",
  },
  franchise: "Aladdin",
  fullName: "Jafar - Tyrannical Hypnotist",
  id: "xg5",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Jafar",
  set: "005",
  strength: 0,
  text: "Challenger +7 (While challenging, this character gets +7 {S}.)\nINTIMIDATING GAZE Opposing characters with cost 4 or less can't challenge.",
  version: "Tyrannical Hypnotist",
  willpower: 7,
};
