import type { CharacterCard } from "@tcg/lorcana-types";

export const baymaxGiantRobot: CharacterCard = {
  id: "1c2",
  cardType: "character",
  name: "Baymax",
  version: "Giant Robot",
  fullName: "Baymax - Giant Robot",
  inkType: ["emerald", "sapphire"],
  franchise: "Big Hero 6",
  set: "007",
  text: "Universal Shift 4 (You may pay 4 {I} to play this on top of any one of your characters.)\nFUNCTIONALITY IMPROVED When you play this character, if you used Shift to play him, remove all damage from him.",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 104,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "ad862baa5875379e40b08691465e23adf5ba70d0",
  },
  abilities: [
    {
      id: "1c2-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Universal Shift 4",
    },
    {
      id: "1c2-2",
      type: "triggered",
      name: "FUNCTIONALITY IMPROVED",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "FUNCTIONALITY IMPROVED When you play this character, if you used Shift to play him, remove all damage from him.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Robot"],
};
