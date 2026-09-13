import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/ancestral-harmony.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const ancestralHarmony = definePitchFamily(fabPitchFamilies["ancestral-harmony"], {
  keywords: [goAgain],
  abilities: () => ({
    attacksComboGet1Turn: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              subtypes: ["Attack"],
            },
            hasKeyword: "combo",
          },
          count: {
            type: "all",
          },
        },
        duration: "this-turn",
      },
    },
    banishTopDeckIfHasComboMayPlayTurn: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                hasKeyword: "combo",
              },
            },
            then: {
              type: "optional",
              effect: {
                type: "play-card",
                fromZones: ["banished"],
                source: {
                  selector: "binding",
                  binding: "it",
                },
                duration: "this-turn",
              },
            },
          },
        ],
      },
    },
  }),
});
export const { blue: ancestralHarmonyBlue } = ancestralHarmony.cards;
