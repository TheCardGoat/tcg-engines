import type { CharacterCard } from "@tcg/lorcana-types";

export const mirabelMadrigalCuriousChild: CharacterCard = {
  id: "191",
  cardType: "character",
  name: "Mirabel Madrigal",
  version: "Curious Child",
  fullName: "Mirabel Madrigal - Curious Child",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "008",
  text: "YOU ARE A WONDER When you play this character, you may reveal a song card in your hand to gain 1 lore.",
  cost: 1,
  strength: 0,
  willpower: 2,
  lore: 1,
  cardNumber: 10,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a39249e29acf0c0edfe7e329190ab01462b8a5be",
  },
  abilities: [
    {
      id: "191-1",
      type: "triggered",
      name: "YOU ARE A WONDER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "gain-lore",
          amount: 1,
        },
        chooser: "CONTROLLER",
      },
      text: "YOU ARE A WONDER When you play this character, you may reveal a song card in your hand to gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Madrigal"],
};
