import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rites-of-earthlore.generated.ts";

export const ritesOfEarthlore = definePitchFamily(fabPitchFamilies["rites-of-earthlore"], {
  parameters: { red: 3, yellow: 2, blue: 1 },
  abilities: (amount) => ({
    triggeredEnterArenaCreateTokenSeismicSurge: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
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
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "seismic-surge",
          controller: "controller",
        },
      },
    },
    triggeredStartPhaseSequenceDestroyModifyNumericPowerThisTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
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

export const {
  red: ritesOfEarthloreRed,
  yellow: ritesOfEarthloreYellow,
  blue: ritesOfEarthloreBlue,
} = ritesOfEarthlore.cards;
