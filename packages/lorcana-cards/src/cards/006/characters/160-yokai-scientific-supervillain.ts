import type { CharacterCard } from "@tcg/lorcana-types";

export const yokaiScientificSupervillain: CharacterCard = {
  id: "11l",
  cardType: "character",
  name: "Yokai",
  version: "Scientific Supervillain",
  fullName: "Yokai - Scientific Supervillain",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Yokai.)\nNEUROTRANSMITTER You may play items named Microbots for free.\nTECHNICAL GAIN Whenever this character quests, draw a card for each opposing character with {S}.",
  cost: 9,
  strength: 6,
  willpower: 10,
  lore: 2,
  cardNumber: 160,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8786d1eedf8f662d74c12dfd082d6ab631d01a63",
  },
  abilities: [
    {
      id: "11l-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 6,
      },
      text: "Shift 6",
    },
    {
      id: "11l-2",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
          cost: "free",
        },
        chooser: "CONTROLLER",
      },
      text: "NEUROTRANSMITTER You may play items named Microbots for free.",
    },
    {
      id: "11l-3",
      type: "triggered",
      name: "TECHNICAL GAIN",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "TECHNICAL GAIN Whenever this character quests, draw a card for each opposing character with {S}.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Inventor"],
};
