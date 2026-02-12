import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineHeirOfAgrabah: CharacterCard = {
  abilities: [
    {
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
      id: "1sv-1",
      name: "I'M A FAST LEARNER",
      text: "I'M A FAST LEARNER When you play this character, remove up to 1 damage from chosen character of yours.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 155,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 1,
  externalIds: {
    ravensburger: "e9c6176500a03f40326172c37792d499cd93be4a",
  },
  franchise: "Aladdin",
  fullName: "Jasmine - Heir of Agrabah",
  id: "1sv",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Jasmine",
  set: "009",
  strength: 1,
  text: "I'M A FAST LEARNER When you play this character, remove up to 1 damage from chosen character of yours.",
  version: "Heir of Agrabah",
  willpower: 2,
};
