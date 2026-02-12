import type { CharacterCard } from "@tcg/lorcana-types";

export const princeEricExpertHelmsman: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "1fb-1",
      name: "SURPRISE MANEUVER",
      text: "SURPRISE MANEUVER When this character is banished, you may banish chosen character.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 121,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Prince"],
  cost: 4,
  externalIds: {
    ravensburger: "052329883cc5cf0357718972204c7f05f1d531df",
  },
  franchise: "Little Mermaid",
  fullName: "Prince Eric - Expert Helmsman",
  id: "1fb",
  inkType: ["ruby"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Prince Eric",
  set: "003",
  strength: 2,
  text: "SURPRISE MANEUVER When this character is banished, you may banish chosen character.",
  version: "Expert Helmsman",
  willpower: 2,
};
