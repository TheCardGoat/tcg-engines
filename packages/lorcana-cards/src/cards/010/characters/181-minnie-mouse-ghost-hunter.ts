import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseGhostHunter: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Alert",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      id: "oy7-1",
      name: "SEARCH THE SHADOWS",
      text: "SEARCH THE SHADOWS When you play this character, chosen Detective character gains Alert this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 181,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Detective"],
  cost: 2,
  externalIds: {
    ravensburger: "59ec24f8abd468cdaaccf255cd749d7799c79be5",
  },
  fullName: "Minnie Mouse - Ghost Hunter",
  id: "oy7",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Minnie Mouse",
  set: "010",
  strength: 2,
  text: "SEARCH THE SHADOWS When you play this character, chosen Detective character gains Alert this turn. (They can challenge as if they had Evasive.)",
  version: "Ghost Hunter",
  willpower: 3,
};
