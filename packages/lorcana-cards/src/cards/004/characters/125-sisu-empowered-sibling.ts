import type { CharacterCard } from "@tcg/lorcana-types";

export const sisuEmpoweredSibling: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 6,
      },
      id: "1q9-1",
      keyword: "Shift",
      text: "Shift 6",
      type: "keyword",
    },
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "1q9-2",
      name: "I GOT THIS!",
      text: "I GOT THIS! When you play this character, banish all opposing characters with 2 {S} or less.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 125,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Deity", "Dragon"],
  cost: 8,
  externalIds: {
    ravensburger: "e06b6bded6dddec463efd1631f0f3855a2a886ca",
  },
  franchise: "Raya and the Last Dragon",
  fullName: "Sisu - Empowered Sibling",
  id: "1q9",
  inkType: ["ruby"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Sisu",
  set: "004",
  strength: 5,
  text: "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Sisu.)\nI GOT THIS! When you play this character, banish all opposing characters with 2 {S} or less.",
  version: "Empowered Sibling",
  willpower: 4,
};
