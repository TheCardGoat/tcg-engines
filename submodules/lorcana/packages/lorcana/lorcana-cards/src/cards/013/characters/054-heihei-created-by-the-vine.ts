import type { CharacterCard } from "@tcg/lorcana-types";
import { heiheiCreatedByTheVineI18n } from "./054-heihei-created-by-the-vine.i18n";

export const heiheiCreatedByTheVine: CharacterCard = {
  id: "HAa",
  canonicalId: "ci_HAa",
  slug: "lorcana-ci_HAa",
  printings: [
    {
      id: "set13-054",
      artId: "set13-054",
      setCode: "set13",
      collectorNumber: "54",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-054"],
  cardType: "character",
  name: "Heihei",
  version: "Created by the Vine",
  inkType: ["amethyst"],
  franchise: "Moana",
  set: "013",
  cardNumber: 54,
  rarity: "rare",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Botanical Remedy",
      description:
        "Whenever one of your Floodborn characters quests, you may move 1 damage from chosen character to chosen opposing character.",
    },
  ],
  classifications: ["Floodborn", "Vineling"],
  abilities: [
    {
      type: "triggered",
      name: "BOTANICAL REMEDY",
      text: "BOTANICAL REMEDY Whenever one of your Floodborn characters quests, you may move 1 damage from chosen character to chosen opposing character.",
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
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "move-damage",
          amount: 1,
          from: "CHOSEN_CHARACTER",
          to: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    },
  ],
  i18n: heiheiCreatedByTheVineI18n,
};
