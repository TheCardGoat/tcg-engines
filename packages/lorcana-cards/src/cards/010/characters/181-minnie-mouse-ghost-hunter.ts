import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseGhostHunter: CharacterCard = {
  id: "oy7",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Ghost Hunter",
  fullName: "Minnie Mouse - Ghost Hunter",
  inkType: ["steel"],
  set: "010",
  text: "SEARCH THE SHADOWS When you play this character, chosen Detective character gains Alert this turn. (They can challenge as if they had Evasive.)",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 181,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "59ec24f8abd468cdaaccf255cd749d7799c79be5",
  },
  abilities: [
    {
      id: "oy7-1",
      type: "triggered",
      name: "SEARCH THE SHADOWS",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Alert",
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      text: "SEARCH THE SHADOWS When you play this character, chosen Detective character gains Alert this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
};
