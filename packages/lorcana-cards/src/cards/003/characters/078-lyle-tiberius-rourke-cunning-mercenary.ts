import type { CharacterCard } from "@tcg/lorcana-types";

export const lyleTiberiusRourkeCunningMercenary: CharacterCard = {
  id: "1s7",
  cardType: "character",
  name: "Lyle Tiberius Rourke",
  version: "Cunning Mercenary",
  fullName: "Lyle Tiberius Rourke - Cunning Mercenary",
  inkType: ["emerald"],
  franchise: "Atlantis",
  set: "003",
  text: "WELL, NOW YOU KNOW When you play this character, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)\nTHANKS FOR VOLUNTEERING Whenever one of your other characters is banished, each opponent loses 1 lore.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 78,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "066d98350f93008c06e7992cf1678ffcf7b1ce13",
  },
  abilities: [
    {
      id: "1s7-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "SELF",
      },
      text: "WELL, NOW YOU KNOW When you play this character, chosen opposing character gains Reckless during their next turn.",
    },
    {
      id: "1s7-2",
      type: "triggered",
      name: "THANKS FOR VOLUNTEERING",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
      text: "THANKS FOR VOLUNTEERING Whenever one of your other characters is banished, each opponent loses 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
