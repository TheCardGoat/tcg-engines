import type { CharacterCard } from "@tcg/lorcana-types";

export const auntCassBiggestFan: CharacterCard = {
  id: "1qq",
  cardType: "character",
  name: "Aunt Cass",
  version: "Biggest Fan",
  fullName: "Aunt Cass - Biggest Fan",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "HAPPY TO HELP Whenever this character quests, chosen Inventor character gets +1 {L} this turn.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 138,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e21945b3edba79d71ce6d25e5a756f1a97ba9337",
  },
  abilities: [
    {
      id: "1qq-1",
      type: "triggered",
      name: "HAPPY TO HELP",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      text: "HAPPY TO HELP Whenever this character quests, chosen Inventor character gets +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
};
