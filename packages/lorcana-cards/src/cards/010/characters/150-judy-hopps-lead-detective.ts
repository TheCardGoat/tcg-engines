import type { CharacterCard } from "@tcg/lorcana-types";

export const judyHoppsLeadDetective: CharacterCard = {
  id: "1c8",
  cardType: "character",
  name: "Judy Hopps",
  version: "Lead Detective",
  fullName: "Judy Hopps - Lead Detective",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "010",
  text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Judy Hopps.)\nLATERAL THINKING During your turn, your Detective characters gain Alert and Resist +2. (They can challenge as if they had Evasive. Damage dealt to them is reduced by 2.)",
  cost: 6,
  strength: 6,
  willpower: 4,
  lore: 2,
  cardNumber: 150,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ade526b78f2bf4c97b7a035fe806854320c80e92",
  },
  abilities: [
    {
      id: "1c8-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4 {I}",
    },
    {
      id: "1c8-2",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Alert",
        target: "YOUR_CHARACTERS",
      },
      text: "LATERAL THINKING During your turn, your Detective characters gain Alert and Resist +2.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Detective"],
};
