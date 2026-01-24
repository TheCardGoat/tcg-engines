import type { CharacterCard } from "@tcg/lorcana-types";

export const johnSilverShipsCook: CharacterCard = {
  id: "1r7",
  cardType: "character",
  name: "John Silver",
  version: "Ship's Cook",
  fullName: "John Silver - Ship's Cook",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  text: "HUNK OF HARDWARE When you play this character, chosen character can't challenge during their next turn.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 181,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e42ba1be2038f64d1b9a6bbdc92549f105c446ec",
  },
  abilities: [
    {
      id: "1r7-1",
      type: "triggered",
      name: "HUNK OF HARDWARE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        target: "SELF",
      },
      text: "HUNK OF HARDWARE When you play this character, chosen character can't challenge during their next turn.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Alien", "Pirate", "Captain"],
};
