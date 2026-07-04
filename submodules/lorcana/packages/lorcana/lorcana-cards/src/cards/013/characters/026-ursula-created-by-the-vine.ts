import type { CharacterCard } from "@tcg/lorcana-types";
import { ursulaCreatedByTheVineI18n } from "./026-ursula-created-by-the-vine.i18n";

export const ursulaCreatedByTheVine: CharacterCard = {
  id: "Y3S",
  canonicalId: "ci_Y3S",
  slug: "lorcana-ci_Y3S",
  printings: [
    {
      id: "set13-026",
      artId: "set13-026",
      setCode: "set13",
      collectorNumber: "26",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-026"],
  cardType: "character",
  name: "Ursula",
  version: "Created by the Vine",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "013",
  cardNumber: 26,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b042269adf7940af8ef301f816235f71",
  },
  text: [
    {
      title: "ENERGY SAP",
      description:
        "Whenever one of your Floodborn characters quests, chosen opposing character gets -1 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Floodborn", "Vineling"],
  abilities: [
    {
      id: "Y3S-1",
      name: "ENERGY SAP",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          reference: "trigger-subject",
          filters: [
            {
              type: "has-classification",
              classification: "Floodborn",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "CHOSEN_OPPOSING_CHARACTER",
        duration: "until-start-of-next-turn",
      },
      text: "ENERGY SAP Whenever one of your Floodborn characters quests, chosen opposing character gets -1 {S} until the start of your next turn.",
    },
  ],
  i18n: ursulaCreatedByTheVineI18n,
};
