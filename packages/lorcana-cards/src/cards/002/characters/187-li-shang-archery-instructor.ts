import type { CharacterCard } from "@tcg/lorcana-types";

export const liShangArcheryInstructor: CharacterCard = {
  id: "1eu",
  cardType: "character",
  name: "Li Shang",
  version: "Archery Instructor",
  fullName: "Li Shang - Archery Instructor",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "002",
  text: "ARCHERY LESSON Whenever this character quests, your characters gain Evasive this turn. (They can challenge characters with Evasive.)",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 187,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b7376a880042a6d1090a8b02680975f23786dc0a",
  },
  abilities: [
    {
      id: "1eu-1",
      type: "triggered",
      name: "ARCHERY LESSON",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
      text: "ARCHERY LESSON Whenever this character quests, your characters gain Evasive this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
