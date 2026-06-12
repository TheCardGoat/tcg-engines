import type { CharacterCard } from "@tcg/lorcana-types";
import { liShangArcheryInstructorI18n } from "./187-li-shang-archery-instructor.i18n";

export const liShangArcheryInstructor: CharacterCard = {
  id: "vB7",
  canonicalId: "ci_vB7",
  reprints: ["set2-187"],
  cardType: "character",
  name: "Li Shang",
  version: "Archery Instructor",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "002",
  cardNumber: 187,
  rarity: "uncommon",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_71250fc9f98742369de2116914b4109f",
    tcgPlayer: 523755,
  },
  text: [
    {
      title: "ARCHERY LESSON",
      description:
        "Whenever this character quests, your characters gain Evasive this turn. (They can challenge characters with Evasive.)",
    },
  ],
  classifications: ["Storyborn", "Hero"],
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
  i18n: liShangArcheryInstructorI18n,
};
