import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bios-update.generated.ts";

import { attackActionFilter } from "@tcg/flesh-and-blood-types";

import { goAgain } from "../shared/keywords.ts";

export const biosUpdate = definePitchFamily(fabPitchFamilies["bios-update"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackActionBoostTurnGains3: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            and: [
              attackActionFilter(),
              {
                wasBoosted: true,
              },
            ],
          },
        },
      },
    },
    nextTimeMechanologistItemCost2LessIsBanished: {
      kind: "resolution",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "banish",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "moved-object",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  supertypes: ["Mechanologist"],
                  subtypes: ["Item"],
                },
                cost: {
                  op: "lte",
                  value: 2,
                },
              },
              bindAs: "it",
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "first",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "move-card",
            target: {
              selector: "binding",
              binding: "it",
            },
            to: {
              zone: "permanent",
            },
          },
        },
      },
    },
  }),
});
export const { red: biosUpdateRed } = biosUpdate.cards;
