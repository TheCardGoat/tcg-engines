import type { CharacterCard } from "@tcg/lorcana-types";

export const chipFriendIndeed: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1x3-1",
      name: "DALE'S PARTNER",
      text: "DALE'S PARTNER When you play this character, chosen character gets +1 {L} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 6,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "f903848c6aae6484763bdfea2e71c79d672e8bda",
  },
  franchise: "Rescue Rangers",
  fullName: "Chip - Friend Indeed",
  id: "1x3",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Chip",
  set: "006",
  strength: 3,
  text: "DALE'S PARTNER When you play this character, chosen character gets +1 {L} this turn.",
  version: "Friend Indeed",
  willpower: 3,
};
