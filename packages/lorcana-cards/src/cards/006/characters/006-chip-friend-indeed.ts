import type { CharacterCard } from "@tcg/lorcana-types";

export const chipFriendIndeed: CharacterCard = {
  id: "1x3",
  cardType: "character",
  name: "Chip",
  version: "Friend Indeed",
  fullName: "Chip - Friend Indeed",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "006",
  text: "DALE'S PARTNER When you play this character, chosen character gets +1 {L} this turn.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 6,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f903848c6aae6484763bdfea2e71c79d672e8bda",
  },
  abilities: [
    {
      id: "1x3-1",
      type: "triggered",
      name: "DALE'S PARTNER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
        duration: "this-turn",
      },
      text: "DALE'S PARTNER When you play this character, chosen character gets +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
