import type { CharacterCard } from "@tcg/lorcana-types";

export const auntCassBiggestFan: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      id: "1qq-1",
      name: "HAPPY TO HELP",
      text: "HAPPY TO HELP Whenever this character quests, chosen Inventor character gets +1 {L} this turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 138,
  cardType: "character",
  classifications: ["Storyborn", "Mentor"],
  cost: 2,
  externalIds: {
    ravensburger: "e21945b3edba79d71ce6d25e5a756f1a97ba9337",
  },
  franchise: "Big Hero 6",
  fullName: "Aunt Cass - Biggest Fan",
  id: "1qq",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Aunt Cass",
  set: "006",
  strength: 1,
  text: "HAPPY TO HELP Whenever this character quests, chosen Inventor character gets +1 {L} this turn.",
  version: "Biggest Fan",
  willpower: 3,
};
