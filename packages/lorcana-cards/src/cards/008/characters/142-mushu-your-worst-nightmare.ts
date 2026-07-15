import type { CharacterCard } from "@tcg/lorcana-types";

export const mushuYourWorstNightmare: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "qm5-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
      effect: {
        duration: "this-turn",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      id: "qm5-2",
      name: "ALL FIRED UP",
      text: "ALL FIRED UP Whenever you play another character, they gain Rush, Reckless, and Evasive this turn.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 142,
  cardType: "character",
  classifications: ["Floodborn", "Ally", "Dragon"],
  cost: 6,
  externalIds: {
    ravensburger: "02aa1e9aa98646eadca05cdb2ebc4c786a06f1a2",
  },
  franchise: "Mulan",
  fullName: "Mushu - Your Worst Nightmare",
  id: "qm5",
  inkType: ["ruby", "steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Mushu",
  set: "008",
  strength: 4,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mushu.)\nALL FIRED UP Whenever you play another character, they gain Rush, Reckless, and Evasive this turn. (They can challenge the turn they’re played. They can’t quest and must challenge if able. They can challenge characters with Evasive.)",
  version: "Your Worst Nightmare",
  willpower: 6,
};
