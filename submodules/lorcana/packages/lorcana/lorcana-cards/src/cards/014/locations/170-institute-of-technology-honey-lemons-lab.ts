import type { LocationCard } from "@tcg/lorcana-types";
import { instituteOfTechnologyHoneyLemonsLabI18n } from "./170-institute-of-technology-honey-lemons-lab.i18n";

export const instituteOfTechnologyHoneyLemonsLab: LocationCard = {
  id: "HMj",
  canonicalId: "ci_HMj",
  slug: "lorcana-ci_HMj",
  printings: [
    {
      id: "set14-170",
      artId: "set14-170",
      setCode: "set14",
      collectorNumber: "170",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-170"],
  cardType: "location",
  name: "Institute of Technology",
  version: "Honey Lemon's Lab",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 170,
  rarity: "uncommon",
  cost: 2,
  willpower: 5,
  moveCost: 1,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Break Time",
      description:
        "Once during your turn, whenever a Super character quests while here, return an item card from your discard to your hand.",
    },
  ],
  abilities: [
    {
      id: "HMj-1",
      name: "Break Time",
      text: "Break Time Once during your turn, whenever a Super character quests while here, return an item card from your discard to your hand.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "CHARACTERS_HERE",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "once-per-turn",
          },
        ],
      },
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          reference: "trigger-subject",
          filters: [
            {
              type: "has-classification",
              classification: "Super",
            },
          ],
        },
      },
      effect: {
        type: "return-from-discard",
        cardType: "item",
        destination: "hand",
        target: "CONTROLLER",
      },
    },
  ],
  i18n: instituteOfTechnologyHoneyLemonsLabI18n,
};
