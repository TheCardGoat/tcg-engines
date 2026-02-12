import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchTeamUnderdog: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "deal-damage",
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        type: "optional",
      },
      id: "jmz-1",
      name: "HEAVE HO!",
      text: "HEAVE HO! When you play this character, you may deal 2 damage to chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 171,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Alien"],
  cost: 4,
  externalIds: {
    ravensburger: "46c74815d938940a1435bdae976105ce9951db9f",
  },
  franchise: "Lilo and Stitch",
  fullName: "Stitch - Team Underdog",
  id: "jmz",
  inkType: ["steel"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Stitch",
  set: "005",
  strength: 1,
  text: "HEAVE HO! When you play this character, you may deal 2 damage to chosen character.",
  version: "Team Underdog",
  willpower: 4,
};
