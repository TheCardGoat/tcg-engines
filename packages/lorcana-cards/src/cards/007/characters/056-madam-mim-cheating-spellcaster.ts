import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimCheatingSpellcaster: CharacterCard = {
  id: "1rw",
  cardType: "character",
  name: "Madam Mim",
  version: "Cheating Spellcaster",
  fullName: "Madam Mim - Cheating Spellcaster",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "007",
  text: "PLAY ROUGH Whenever this character quests, exert chosen opposing character.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 56,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e64deb540e72f37a0acc06a08a062edf3bb60304",
  },
  abilities: [
    {
      id: "1rw-1",
      type: "triggered",
      name: "PLAY ROUGH",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "exert",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "PLAY ROUGH Whenever this character quests, exert chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
