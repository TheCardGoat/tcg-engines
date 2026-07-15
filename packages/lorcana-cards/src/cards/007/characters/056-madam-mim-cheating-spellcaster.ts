import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimCheatingSpellcaster: CharacterCard = {
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
        },
        type: "exert",
      },
      id: "1rw-1",
      name: "PLAY ROUGH",
      text: "PLAY ROUGH Whenever this character quests, exert chosen opposing character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 56,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  cost: 6,
  externalIds: {
    ravensburger: "e64deb540e72f37a0acc06a08a062edf3bb60304",
  },
  franchise: "Sword in the Stone",
  fullName: "Madam Mim - Cheating Spellcaster",
  id: "1rw",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Madam Mim",
  set: "007",
  strength: 4,
  text: "PLAY ROUGH Whenever this character quests, exert chosen opposing character.",
  version: "Cheating Spellcaster",
  willpower: 5,
};
