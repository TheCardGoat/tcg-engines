import type { CharacterCard } from "@tcg/lorcana-types";
import { aladdinResearchAssistantI18n } from "./197-aladdin-research-assistant.i18n";

export const aladdinResearchAssistant: CharacterCard = {
  id: "H1M",
  canonicalId: "ci_H1M",
  reprints: ["set7-197"],
  cardType: "character",
  name: "Aladdin",
  version: "Research Assistant",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "007",
  cardNumber: 197,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_cf7a354247654f8f914b04e101558f6f",
    tcgPlayer: 619521,
  },
  text: [
    {
      title: "HELPING HAND",
      description:
        "Whenever this character quests, you may play an Ally character with cost 3 or less for free.",
    },
    {
      title: "PUT IN THE EFFORT",
      description: "While this character is exerted, your Ally characters get +1 {S}.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cost: "free",
          costRestriction: {
            comparison: "less-or-equal",
            value: 3,
          },
          filter: {
            cardType: "character",
            classification: "Ally",
          },
          from: "hand",
          type: "play-card",
        },
        type: "optional",
      },
      id: "1do-1",
      name: "HELPING HAND",
      text: "HELPING HAND Whenever this character quests, you may play an Ally character with cost 3 or less for free.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: {
          count: "all",
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Ally",
            },
          ],
        },
        type: "modify-stat",
      },
      condition: {
        type: "exerted",
      },
      id: "1do-2",
      name: "PUT IN THE EFFORT",
      text: "PUT IN THE EFFORT While this character is exerted, your Ally characters get +1 {S}.",
      type: "static",
    },
  ],
  i18n: aladdinResearchAssistantI18n,
};
