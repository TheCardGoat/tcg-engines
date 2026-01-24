import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineHeirOfAgrabah: CharacterCard = {
  id: "1sv",
  cardType: "character",
  name: "Jasmine",
  version: "Heir of Agrabah",
  fullName: "Jasmine - Heir of Agrabah",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "009",
  text: "I'M A FAST LEARNER When you play this character, remove up to 1 damage from chosen character of yours.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 155,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e9c6176500a03f40326172c37792d499cd93be4a",
  },
  abilities: [
    {
      id: "1sv-1",
      type: "triggered",
      name: "I'M A FAST LEARNER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "remove-damage",
        amount: 1,
        upTo: true,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "I'M A FAST LEARNER When you play this character, remove up to 1 damage from chosen character of yours.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
