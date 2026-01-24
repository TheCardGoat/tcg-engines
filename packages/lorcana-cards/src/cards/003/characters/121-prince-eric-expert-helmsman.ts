import type { CharacterCard } from "@tcg/lorcana-types";

export const princeEricExpertHelmsman: CharacterCard = {
  id: "1fb",
  cardType: "character",
  name: "Prince Eric",
  version: "Expert Helmsman",
  fullName: "Prince Eric - Expert Helmsman",
  inkType: ["ruby"],
  franchise: "Little Mermaid",
  set: "003",
  text: "SURPRISE MANEUVER When this character is banished, you may banish chosen character.",
  cost: 4,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 121,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "052329883cc5cf0357718972204c7f05f1d531df",
  },
  abilities: [
    {
      id: "1fb-1",
      type: "triggered",
      name: "SURPRISE MANEUVER",
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
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "SURPRISE MANEUVER When this character is banished, you may banish chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince"],
};
