import type { LocationCard } from "@tcg/lorcana-types";
import { winterCampMedicalTentI18n } from "./170-winter-camp-medical-tent.i18n";

export const winterCampMedicalTent: LocationCard = {
  id: "oLN",
  canonicalId: "ci_oLN",
  reprints: ["set4-170"],
  cardType: "location",
  name: "Winter Camp",
  version: "Medical Tent",
  inkType: ["sapphire"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 170,
  rarity: "common",
  cost: 3,
  willpower: 8,
  moveCost: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0d7681a6ac944b5aa5606946cff8ebd5",
    tcgPlayer: 550616,
  },
  text: [
    {
      title: "HELP THE WOUNDED",
      description:
        "Whenever a character quests while here, remove up to 2 damage from them. If they're a Hero character, remove up to 4 damage instead.",
    },
  ],
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            amount: { type: "up-to", value: 2 },
            target: {
              selector: "all",
              count: 1,
              reference: "trigger-subject",
            },
            type: "remove-damage",
          },
          {
            type: "conditional",
            condition: {
              type: "target-query",
              query: {
                selector: "all",
                reference: "trigger-subject",
                cardType: "character",
                filters: [
                  {
                    type: "has-classification",
                    classification: "Hero",
                  },
                ],
              },
              comparison: {
                operator: "gte",
                value: 1,
              },
            },
            then: {
              amount: { type: "up-to", value: 2 },
              target: {
                selector: "all",
                count: 1,
                reference: "trigger-subject",
              },
              type: "remove-damage",
            },
          },
        ],
      },
      id: "129-1",
      name: "HELP THE WOUNDED",
      text: "HELP THE WOUNDED Whenever a character quests while here, remove up to 2 damage from them. If they're a Hero character, remove up to 4 damage instead.",
      trigger: {
        event: "quest",
        on: "CHARACTERS_HERE",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: winterCampMedicalTentI18n,
};
