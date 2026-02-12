import type { CharacterCard } from "@tcg/lorcana-types";

export const lyleTiberiusRourkeCunningMercenary: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "SELF",
      },
      id: "1s7-1",
      text: "WELL, NOW YOU KNOW When you play this character, chosen opposing character gains Reckless during their next turn.",
      type: "action",
    },
    {
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
      id: "1s7-2",
      name: "THANKS FOR VOLUNTEERING",
      text: "THANKS FOR VOLUNTEERING Whenever one of your other characters is banished, each opponent loses 1 lore.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 78,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 3,
  externalIds: {
    ravensburger: "066d98350f93008c06e7992cf1678ffcf7b1ce13",
  },
  franchise: "Atlantis",
  fullName: "Lyle Tiberius Rourke - Cunning Mercenary",
  id: "1s7",
  inkType: ["emerald"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Lyle Tiberius Rourke",
  set: "003",
  strength: 2,
  text: "WELL, NOW YOU KNOW When you play this character, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)\nTHANKS FOR VOLUNTEERING Whenever one of your other characters is banished, each opponent loses 1 lore.",
  version: "Cunning Mercenary",
  willpower: 4,
};
