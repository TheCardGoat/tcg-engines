import type { CharacterCard } from "@tcg/lorcana-types";

export const billyBonesSpaceSailor: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
        },
        chooser: "CONTROLLER",
      },
      id: "1oc-1",
      name: "KEEP IT HIDDEN",
      text: "KEEP IT HIDDEN When this character is banished, you may banish chosen item or location.",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 185,
  cardType: "character",
  classifications: ["Storyborn", "Alien", "Pirate"],
  cost: 3,
  externalIds: {
    ravensburger: "d9747118f33198abebde6af5d847e6ea933d788e",
  },
  franchise: "Treasure Planet",
  fullName: "Billy Bones - Space Sailor",
  id: "1oc",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Billy Bones",
  set: "006",
  strength: 2,
  text: "KEEP IT HIDDEN When this character is banished, you may banish chosen item or location.",
  version: "Space Sailor",
  willpower: 2,
};
