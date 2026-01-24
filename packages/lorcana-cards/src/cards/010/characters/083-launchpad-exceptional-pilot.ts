import type { CharacterCard } from "@tcg/lorcana-types";

export const launchpadExceptionalPilot: CharacterCard = {
  id: "m1r",
  cardType: "character",
  name: "Launchpad",
  version: "Exceptional Pilot",
  fullName: "Launchpad - Exceptional Pilot",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  text: "OFF THE MAP When you play this character, you may banish chosen location.",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  cardNumber: 83,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4f77725589536ddc85294a41b48dcd409ec34d34",
  },
  abilities: [
    {
      id: "m1r-1",
      type: "triggered",
      name: "OFF THE MAP",
      trigger: {
        event: "play",
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
            cardTypes: ["location"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "OFF THE MAP When you play this character, you may banish chosen location.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
