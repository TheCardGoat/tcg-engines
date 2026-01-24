import type { CharacterCard } from "@tcg/lorcana-types";

export const mushuYourWorstNightmare: CharacterCard = {
  id: "qm5",
  cardType: "character",
  name: "Mushu",
  version: "Your Worst Nightmare",
  fullName: "Mushu - Your Worst Nightmare",
  inkType: ["ruby", "steel"],
  franchise: "Mulan",
  set: "008",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mushu.)\nALL FIRED UP Whenever you play another character, they gain Rush, Reckless, and Evasive this turn. (They can challenge the turn they’re played. They can’t quest and must challenge if able. They can challenge characters with Evasive.)",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 2,
  cardNumber: 142,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "02aa1e9aa98646eadca05cdb2ebc4c786a06f1a2",
  },
  abilities: [
    {
      id: "qm5-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
    {
      id: "qm5-2",
      type: "triggered",
      name: "ALL FIRED UP",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      text: "ALL FIRED UP Whenever you play another character, they gain Rush, Reckless, and Evasive this turn.",
    },
  ],
  classifications: ["Floodborn", "Ally", "Dragon"],
};
