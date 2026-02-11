import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckGhostHunter: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: "CHOSEN_CHARACTER",
        value: 2,
        duration: "this-turn",
      },
      id: "1u3-1",
      name: "RAISE A RUCKUS",
      text: "RAISE A RUCKUS When you play this character, chosen Detective character gains Challenger +2 this turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 172,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Detective"],
  cost: 4,
  externalIds: {
    ravensburger: "ee4403fdc349e124edd32c403fda6877f4f8c500",
  },
  fullName: "Donald Duck - Ghost Hunter",
  id: "1u3",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Donald Duck",
  set: "010",
  strength: 5,
  text: "RAISE A RUCKUS When you play this character, chosen Detective character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  version: "Ghost Hunter",
  willpower: 4,
};
