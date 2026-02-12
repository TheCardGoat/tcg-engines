import type { CharacterCard } from "@tcg/lorcana-types";

export const liShangArcheryInstructor: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Evasive",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
      },
      id: "1eu-1",
      name: "ARCHERY LESSON",
      text: "ARCHERY LESSON Whenever this character quests, your characters gain Evasive this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 187,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 5,
  externalIds: {
    ravensburger: "b7376a880042a6d1090a8b02680975f23786dc0a",
  },
  franchise: "Mulan",
  fullName: "Li Shang - Archery Instructor",
  id: "1eu",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Li Shang",
  set: "002",
  strength: 3,
  text: "ARCHERY LESSON Whenever this character quests, your characters gain Evasive this turn. (They can challenge characters with Evasive.)",
  version: "Archery Instructor",
  willpower: 6,
};
