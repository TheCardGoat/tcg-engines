import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/vengeful-apparition.generated.ts";
import { ward } from "../shared/keywords.ts";

const abilities = {
  triggeredEffect: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event-and-state",
      event: {
        name: "leave-arena",
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
            supertypes: ["Illusionist"],
            subtypes: ["Aura"],
          },
        },
        comparison: {
          op: "eq",
          value: 0,
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "play-card",
            fromZones: ["hand", "arsenal"],
            source: {
              selector: "self",
            },
            appliesTo: {
              next: {
                typeBox: {
                  subtypes: ["Aura"],
                },
                cost: {
                  op: "lte",
                  value: 2,
                },
              },
              events: ["play", "attack"],
            },
            duration: "this-turn",
            asType: "instant",
          },
          {
            type: "replacement",
            replacementKind: "standard",
            replaces: {
              name: "enter-arena",
              subject: {
                typeBox: {
                  subtypes: ["Aura"],
                },
                cost: {
                  op: "lte",
                  value: 2,
                },
              },
            },
            appliesTo: {
              next: {
                typeBox: {
                  subtypes: ["Aura"],
                },
                cost: {
                  op: "lte",
                  value: 2,
                },
              },
              events: ["play", "attack"],
            },
            modification: {
              type: "add-counter",
              counter: {
                kind: "numeric",
                value: 1,
                property: "power",
              },
              count: 1,
              target: {
                selector: "self",
              },
            },
            duration: "this-turn",
          },
        ],
      },
    },
  },
} as const;

export const vengefulApparition = definePitchFamily(fabPitchFamilies["vengeful-apparition"], {
  keywords: [ward(1)],
  abilities: () => abilities,
});

export const {
  red: vengefulApparitionRed,
  yellow: vengefulApparitionYellow,
  blue: vengefulApparitionBlue,
} = vengefulApparition.cards;
