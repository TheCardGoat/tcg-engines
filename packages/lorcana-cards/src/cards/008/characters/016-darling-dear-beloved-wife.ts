import type { CharacterCard } from "@tcg/lorcana-types";

export const darlingDearBelovedWife: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "lore",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "modify-stat",
      },
      id: "1j2-1",
      name: "HOW SWEET",
      text: "HOW SWEET When you play this character, chosen character gets +2 {L} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
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
