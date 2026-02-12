import type { CharacterCard } from "@tcg/lorcana-types";

export const launchpadExceptionalPilot: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["location"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "m1r-1",
      name: "OFF THE MAP",
      text: "OFF THE MAP When you play this character, you may banish chosen location.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 83,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "4f77725589536ddc85294a41b48dcd409ec34d34",
  },
  franchise: "Ducktales",
  fullName: "Launchpad - Exceptional Pilot",
  id: "m1r",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Launchpad",
  set: "010",
  strength: 4,
  text: "OFF THE MAP When you play this character, you may banish chosen location.",
  version: "Exceptional Pilot",
  willpower: 4,
};
