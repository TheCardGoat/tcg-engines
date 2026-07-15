import type { CharacterCard } from "@tcg/lorcana-types";
import { sproutExperiment509I18n } from "./179-sprout-experiment-509.i18n";

import { resist } from "../../../helpers/abilities/resist";

export const sproutExperiment509: CharacterCard = {
  id: "YA4",
  canonicalId: "ci_YA4",
  slug: "lorcana-ci_YA4",
  printings: [
    {
      id: "set13-179",
      artId: "set13-179",
      setCode: "set13",
      collectorNumber: "179",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-179"],
  cardType: "character",
  name: "Sprout",
  version: "Experiment 509",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "013",
  cardNumber: 179,
  rarity: "rare",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_60150c9c325b46adaa51b606ccd3deaa",
  },
  text: [
    {
      title: "Resist +1",
    },
    {
      title: "BOTANICAL EVIL",
      description:
        "When you play this character, you may choose and discard an Alien character card or a location card from your hand. If you do, deal 2 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Alien"],
  abilities: [
    resist(1),
    {
      type: "triggered",
      name: "Botanical Evil",
      text: "Botanical Evil When you play this character, you may choose and discard an Alien character card or a location card from your hand. If you do, deal 2 damage to chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "discard",
              amount: 1,
              target: "CONTROLLER",
              chosen: true,
              from: "hand",
              filter: {
                type: "or",
                filters: [
                  {
                    type: "and",
                    filters: [
                      {
                        type: "card-type",
                        value: "character",
                      },
                      {
                        type: "has-classification",
                        classification: "Alien",
                      },
                    ],
                  },
                  {
                    type: "card-type",
                    value: "location",
                  },
                ],
              },
            },
            {
              type: "conditional",
              condition: {
                type: "if-you-do",
              },
              then: {
                type: "deal-damage",
                amount: 2,
                target: {
                  selector: "chosen",
                  count: 1,
                  owner: "any",
                  zones: ["play"],
                  cardTypes: ["character"],
                },
              },
            },
          ],
        },
      },
    },
  ],
  i18n: sproutExperiment509I18n,
};
