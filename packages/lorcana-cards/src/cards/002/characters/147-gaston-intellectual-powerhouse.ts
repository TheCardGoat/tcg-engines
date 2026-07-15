import type { CharacterCard } from "@tcg/lorcana-types";

export const gastonIntellectualPowerhouse: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "14c-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "CHOSEN_CHARACTER",
          type: "put-on-bottom",
        },
        type: "optional",
      },
      id: "14c-2",
      name: "DEVELOPED BRAIN",
      text: "DEVELOPED BRAIN When you play this character, look at the top 3 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 147,
  cardType: "character",
  classifications: ["Floodborn", "Villain"],
  cost: 6,
  externalIds: {
    ravensburger: "915d35f346eb17d9a3d109dce4edbdff38dfebeb",
  },
  franchise: "Beauty and the Beast",
  fullName: "Gaston - Intellectual Powerhouse",
  id: "14c",
  inkType: ["sapphire"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Gaston",
  set: "002",
  strength: 4,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Gaston.)\nDEVELOPED BRAIN When you play this character, look at the top 3 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.",
  version: "Intellectual Powerhouse",
  willpower: 4,
};
