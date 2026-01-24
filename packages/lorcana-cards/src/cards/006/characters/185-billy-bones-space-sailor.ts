import type { CharacterCard } from "@tcg/lorcana-types";

export const billyBonesSpaceSailor: CharacterCard = {
  id: "1oc",
  cardType: "character",
  name: "Billy Bones",
  version: "Space Sailor",
  fullName: "Billy Bones - Space Sailor",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  text: "KEEP IT HIDDEN When this character is banished, you may banish chosen item or location.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 185,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d9747118f33198abebde6af5d847e6ea933d788e",
  },
  abilities: [
    {
      id: "1oc-1",
      type: "triggered",
      name: "KEEP IT HIDDEN",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
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
      text: "KEEP IT HIDDEN When this character is banished, you may banish chosen item or location.",
    },
  ],
  classifications: ["Storyborn", "Alien", "Pirate"],
};
