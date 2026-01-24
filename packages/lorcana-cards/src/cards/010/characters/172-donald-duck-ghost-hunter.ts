import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckGhostHunter: CharacterCard = {
  id: "1u3",
  cardType: "character",
  name: "Donald Duck",
  version: "Ghost Hunter",
  fullName: "Donald Duck - Ghost Hunter",
  inkType: ["steel"],
  set: "010",
  text: "RAISE A RUCKUS When you play this character, chosen Detective character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  cost: 4,
  strength: 5,
  willpower: 4,
  lore: 1,
  cardNumber: 172,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ee4403fdc349e124edd32c403fda6877f4f8c500",
  },
  abilities: [
    {
      id: "1u3-1",
      type: "triggered",
      name: "RAISE A RUCKUS",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: "CHOSEN_CHARACTER",
        value: 2,
        duration: "this-turn",
      },
      text: "RAISE A RUCKUS When you play this character, chosen Detective character gains Challenger +2 this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
};
