import type { CharacterCard } from "@tcg/lorcana-types";

export const fredMajorScienceEnthusiast: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
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
        type: "optional",
      },
      id: "1pz-1",
      name: "SPITTING FIRE!",
      text: "SPITTING FIRE! When you play this character, you may banish chosen item.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 92,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "df5a3f3c8627d10f208025273bc69c829954acda",
  },
  franchise: "Big Hero 6",
  fullName: "Fred - Major Science Enthusiast",
  id: "1pz",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Fred",
  set: "008",
  strength: 2,
  text: "SPITTING FIRE! When you play this character, you may banish chosen item.",
  version: "Major Science Enthusiast",
  willpower: 3,
};
