import type { CharacterCard } from "@tcg/lorcana-types";

export const auntCassBiggestFan: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "1qq-1",
      name: "HAPPY TO HELP",
      text: "HAPPY TO HELP Whenever this character quests, chosen Inventor character gets +1 {L} this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
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
