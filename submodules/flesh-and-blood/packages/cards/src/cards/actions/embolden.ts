import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/embolden.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const embolden = definePitchFamily(fabPitchFamilies["embolden"], {
  parameters: pitchMap({ red: 5, yellow: 4, blue: 3 }),
  keywords: [goAgain],
  abilities: (amount) => ({
    staticTriggeredEnterArenaDraw: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "enter-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
        state: {
          type: "zone-count",
          zone: "permanent",
          player: "controller",
          filter: {
            typeBox: {
              subtypes: ["Aura"],
              excludeMetatypes: ["Token"],
            },
          },
          comparison: {
            op: "gte",
            value: 2,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "draw",
          count: 1,
          player: "controller",
        },
      },
    },
    staticTriggeredActionPhaseStartSequence: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: amount,
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  typeBox: {
                    supertypes: ["Guardian"],
                    types: ["Action"],
                    subtypes: ["Attack"],
                  },
                },
              },
            },
          ],
        },
      },
    },
  }),
});
export const { red: emboldenRed, yellow: emboldenYellow, blue: emboldenBlue } = embolden.cards;
