import type { CharacterCard } from "@tcg/lorcana-types";

export const kaaHypnotizingPython: CharacterCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: -2,
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "gain-keyword",
            keyword: "Reckless",
            target: "SELF",
          },
        ],
        type: "sequence",
      },
      id: "1v1-1",
      name: "LOOK ME IN THE EYE",
      text: "LOOK ME IN THE EYE Whenever this character quests, chosen opposing character gets -2 {S} and gains Reckless until the start of your next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 21,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 4,
  externalIds: {
    ravensburger: "f282a36bea0b86730827e7de3e6e6879a13d9171",
  },
  franchise: "Jungle Book",
  fullName: "Kaa - Hypnotizing Python",
  id: "1v1",
  inkType: ["amber", "emerald"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Kaa",
  set: "008",
  strength: 3,
  text: "LOOK ME IN THE EYE Whenever this character quests, chosen opposing character gets -2 {S} and gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)",
  version: "Hypnotizing Python",
  willpower: 3,
};
