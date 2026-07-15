import type { CharacterCard } from "@tcg/lorcana-types";

export const sirPellinoreSeasonedKnight: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Support",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
      },
      id: "6h9-1",
      name: "CODE OF HONOR",
      text: "CODE OF HONOR Whenever this character quests, your other characters gain Support this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 154,
  cardType: "character",
  classifications: ["Storyborn", "Knight"],
  cost: 3,
  externalIds: {
    ravensburger: "175a1ce711b1cd4735cd50baf660818ce2375922",
  },
  franchise: "Sword in the Stone",
  fullName: "Sir Pellinore - Seasoned Knight",
  id: "6h9",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Sir Pellinore",
  set: "008",
  strength: 1,
  text: "CODE OF HONOR Whenever this character quests, your other characters gain Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Seasoned Knight",
  willpower: 4,
};
