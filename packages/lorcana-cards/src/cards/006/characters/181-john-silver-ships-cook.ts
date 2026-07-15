import type { CharacterCard } from "@tcg/lorcana-types";

export const johnSilverShipsCook: CharacterCard = {
  abilities: [
    {
      effect: {
        restriction: "cant-challenge",
        target: "SELF",
        type: "restriction",
      },
      id: "1r7-1",
      name: "HUNK OF HARDWARE",
      text: "HUNK OF HARDWARE When you play this character, chosen character can't challenge during their next turn.",
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
  classifications: ["Storyborn", "Villain", "Alien", "Pirate", "Captain"],
  cost: 3,
  externalIds: {
    ravensburger: "e42ba1be2038f64d1b9a6bbdc92549f105c446ec",
  },
  franchise: "Treasure Planet",
  fullName: "John Silver - Ship's Cook",
  id: "1r7",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "John Silver",
  set: "006",
  strength: 3,
  text: "HUNK OF HARDWARE When you play this character, chosen character can't challenge during their next turn.",
  version: "Ship's Cook",
  willpower: 3,
};
