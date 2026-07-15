import type { CharacterCard } from "@tcg/lorcana-types";
import { aladdinCreatedByTheVineI18n } from "./177-aladdin-created-by-the-vine.i18n";

export const aladdinCreatedByTheVine: CharacterCard = {
  id: "bsG",
  canonicalId: "ci_bsG",
  slug: "lorcana-ci_bsG",
  printings: [
    {
      id: "set13-177",
      artId: "set13-177",
      setCode: "set13",
      collectorNumber: "177",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-177"],
  cardType: "character",
  name: "Aladdin",
  version: "Created by the Vine",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "013",
  cardNumber: 177,
  rarity: "rare",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "The Vine Provides",
      description:
        "Whenever one of your Floodborn characters quests, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Floodborn", "Vineling"],
  abilities: [
    {
      type: "triggered",
      name: "THE VINE PROVIDES",
      text: "THE VINE PROVIDES Whenever one of your Floodborn characters quests, you may draw a card, then choose and discard a card.",
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
          type: "sequence",
          steps: [
            {
              type: "draw",
              amount: 1,
              target: "CONTROLLER",
            },
            {
              type: "discard",
              amount: 1,
              target: "CONTROLLER",
              chosen: true,
            },
          ],
        },
      },
    },
  ],
  i18n: aladdinCreatedByTheVineI18n,
};
