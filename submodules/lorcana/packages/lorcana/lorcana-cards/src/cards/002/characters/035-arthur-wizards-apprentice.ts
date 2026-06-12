import type { CharacterCard } from "@tcg/lorcana-types";
import { arthurWizardsApprenticeI18n } from "./035-arthur-wizards-apprentice.i18n";

export const arthurWizardsApprentice: CharacterCard = {
  id: "W0X",
  canonicalId: "ci_tMV",
  reprints: ["set2-035"],
  cardType: "character",
  name: "Arthur",
  version: "Wizard's Apprentice",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  cardNumber: 35,
  rarity: "common",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_19431b87131547d98fef8a693077a77e",
    tcgPlayer: 527797,
  },
  text: [
    {
      title: "STUDENT",
      description:
        "Whenever this character quests, you may return another chosen character of yours to your hand to gain 2 lore.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Sorcerer"],
  abilities: [
    {
      effect: {
        steps: [
          {
            chooser: "CONTROLLER",
            effect: {
              steps: [
                {
                  target: {
                    cardTypes: ["character"],
                    count: 1,
                    excludeSelf: true,
                    owner: "you",
                    selector: "chosen",
                    zones: ["play"],
                  },
                  type: "return-to-hand",
                },
                {
                  condition: {
                    type: "if-you-do",
                  },
                  then: {
                    amount: 2,
                    type: "gain-lore",
                  },
                  type: "conditional",
                },
              ],
              type: "sequence",
            },
            type: "optional",
          },
        ],
        type: "sequence",
      },
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      id: "W0X-1",
      name: "STUDENT",
      text: "STUDENT Whenever this character quests, you may return another chosen character of yours to your hand to gain 2 lore.",
      type: "triggered",
    },
  ],
  i18n: arthurWizardsApprenticeI18n,
};
