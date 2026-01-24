import type { CharacterCard } from "@tcg/lorcana-types";

export const fredMajorScienceEnthusiast: CharacterCard = {
  id: "1pz",
  cardType: "character",
  name: "Fred",
  version: "Major Science Enthusiast",
  fullName: "Fred - Major Science Enthusiast",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "008",
  text: "SPITTING FIRE! When you play this character, you may banish chosen item.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 92,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "df5a3f3c8627d10f208025273bc69c829954acda",
  },
  abilities: [
    {
      id: "1pz-1",
      type: "triggered",
      name: "SPITTING FIRE!",
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
            cardTypes: ["item"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "SPITTING FIRE! When you play this character, you may banish chosen item.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
