import type { CharacterCard } from "@tcg/lorcana-types";

export const yokaiScientificSupervillain: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 6,
      },
      id: "11l-1",
      keyword: "Shift",
      text: "Shift 6",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cost: "free",
          from: "hand",
          type: "play-card",
        },
        type: "optional",
      },
      id: "11l-2",
      text: "NEUROTRANSMITTER You may play items named Microbots for free.",
      type: "action",
    },
    {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      id: "11l-3",
      name: "TECHNICAL GAIN",
      text: "TECHNICAL GAIN Whenever this character quests, draw a card for each opposing character with {S}.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 160,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "Inventor"],
  cost: 9,
  externalIds: {
    ravensburger: "8786d1eedf8f662d74c12dfd082d6ab631d01a63",
  },
  franchise: "Big Hero 6",
  fullName: "Yokai - Scientific Supervillain",
  id: "11l",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Yokai",
  set: "006",
  strength: 6,
  text: "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Yokai.)\nNEUROTRANSMITTER You may play items named Microbots for free.\nTECHNICAL GAIN Whenever this character quests, draw a card for each opposing character with {S}.",
  version: "Scientific Supervillain",
  willpower: 10,
};
