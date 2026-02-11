import type { CharacterCard } from "@tcg/lorcana-types";

export const darlingDearBelovedWife: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      id: "1j2-1",
      name: "HOW SWEET",
      text: "HOW SWEET When you play this character, chosen character gets +2 {L} this turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 16,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "c79b2be577f57d10e268462d5266900613098ea1",
  },
  franchise: "Lady and the Tramp",
  fullName: "Darling Dear - Beloved Wife",
  id: "1j2",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Darling Dear",
  set: "008",
  strength: 4,
  text: "HOW SWEET When you play this character, chosen character gets +2 {L} this turn.",
  version: "Beloved Wife",
  willpower: 4,
};
