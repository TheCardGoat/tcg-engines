import type { CharacterCard } from "@tcg/lorcana-types";
import { heiheiCreatedByTheVineEpicI18n } from "./211-heihei-created-by-the-vine-epic.i18n";

export const heiheiCreatedByTheVineEpic: CharacterCard = {
  id: "Dkv",
  canonicalId: "ci_HAa",
  slug: "lorcana-ci_HAa",
  printings: [
    {
      id: "set13-211-epic",
      artId: "ci_HAa-epic",
      setCode: "set13",
      collectorNumber: "211",
      rarity: "epic",
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
  cardNumber: 211,
  rarity: "epic",
  specialRarity: "epic",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c555754465584652a1243655312f4e11",
    tcgPlayer: "704575",
  },
  text: [
    {
      title: "BOTANICAL REMEDY",
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
  i18n: heiheiCreatedByTheVineEpicI18n,
};
