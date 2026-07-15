import type { CharacterCard } from "@tcg/lorcana-types";

export const judyHoppsLeadDetective: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "1c8-1",
      keyword: "Shift",
      text: "Shift 4 {I}",
      type: "keyword",
    },
    {
      effect: {
        keyword: "Alert",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
      },
      id: "1c8-2",
      text: "LATERAL THINKING During your turn, your Detective characters gain Alert and Resist +2.",
      type: "static",
    },
  ],
  cardNumber: 150,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Detective"],
  cost: 6,
  externalIds: {
    ravensburger: "ade526b78f2bf4c97b7a035fe806854320c80e92",
  },
  franchise: "Zootropolis",
  fullName: "Judy Hopps - Lead Detective",
  id: "1c8",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Judy Hopps",
  set: "010",
  strength: 6,
  text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Judy Hopps.)\nLATERAL THINKING During your turn, your Detective characters gain Alert and Resist +2. (They can challenge as if they had Evasive. Damage dealt to them is reduced by 2.)",
  version: "Lead Detective",
  willpower: 4,
};
