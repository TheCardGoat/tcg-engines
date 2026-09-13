import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/emerging-dominance.generated.ts";
import { dominate } from "../shared/keywords.ts";
export const emergingDominance = definePitchFamily(fabPitchFamilies["emerging-dominance"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
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
              type: "sequence",
              steps: [
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
                {
                  type: "grant-property",
                  property: {
                    kind: "keyword",
                    keyword: dominate,
                  },
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
          ],
        },
      },
    },
  }),
});
export const {
  red: emergingDominanceRed,
  yellow: emergingDominanceYellow,
  blue: emergingDominanceBlue,
} = emergingDominance.cards;
