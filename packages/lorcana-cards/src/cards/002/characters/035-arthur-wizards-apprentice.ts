import type { CharacterCard } from "@tcg/lorcana-types";

export const arthurWizardsApprentice: CharacterCard = {
  id: "gq1",
  cardType: "character",
  name: "Arthur",
  version: "Wizard's Apprentice",
  fullName: "Arthur - Wizard's Apprentice",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "STUDENT Whenever this character quests, you may return another chosen character of yours to your hand to gain 2 lore.",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 35,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "3c45ec5faee5f49118a102e59e99043cc430699b",
  },
  abilities: [
    {
      id: "gq1-1",
      type: "triggered",
      name: "STUDENT",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "gain-lore",
          amount: 2,
        },
        chooser: "CONTROLLER",
      },
      text: "STUDENT Whenever this character quests, you may return another chosen character of yours to your hand to gain 2 lore.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Sorcerer"],
};
