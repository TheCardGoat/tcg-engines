import type { CharacterCard } from "@tcg/lorcana-types";

export const arthurWizardsApprentice: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          type: "gain-lore",
        },
        type: "optional",
      },
      id: "gq1-1",
      name: "STUDENT",
      text: "STUDENT Whenever this character quests, you may return another chosen character of yours to your hand to gain 2 lore.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 35,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Sorcerer"],
  cost: 3,
  externalIds: {
    ravensburger: "3c45ec5faee5f49118a102e59e99043cc430699b",
  },
  franchise: "Sword in the Stone",
  fullName: "Arthur - Wizard's Apprentice",
  id: "gq1",
  inkType: ["amethyst"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Arthur",
  set: "002",
  strength: 1,
  text: "STUDENT Whenever this character quests, you may return another chosen character of yours to your hand to gain 2 lore.",
  version: "Wizard's Apprentice",
  willpower: 3,
};
