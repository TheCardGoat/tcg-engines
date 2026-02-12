import type { CharacterCard } from "@tcg/lorcana-types";

export const baymaxGiantRobot: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "1c2-1",
      keyword: "Shift",
      text: "Universal Shift 4",
      type: "keyword",
    },
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "1c2-2",
      name: "FUNCTIONALITY IMPROVED",
      text: "FUNCTIONALITY IMPROVED When you play this character, if you used Shift to play him, remove all damage from him.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 104,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Robot"],
  cost: 6,
  externalIds: {
    ravensburger: "ad862baa5875379e40b08691465e23adf5ba70d0",
  },
  franchise: "Big Hero 6",
  fullName: "Baymax - Giant Robot",
  id: "1c2",
  inkType: ["emerald", "sapphire"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Baymax",
  set: "007",
  strength: 5,
  text: "Universal Shift 4 (You may pay 4 {I} to play this on top of any one of your characters.)\nFUNCTIONALITY IMPROVED When you play this character, if you used Shift to play him, remove all damage from him.",
  version: "Giant Robot",
  willpower: 5,
};
