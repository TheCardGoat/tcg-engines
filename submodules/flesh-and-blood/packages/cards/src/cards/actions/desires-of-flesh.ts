import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/desires-of-flesh.generated.ts";
import { stealth } from "../shared/keywords.ts";
const abilities = {
  onHitBanish: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "hit",
        actor: {
          kind: "player",
          player: "ability-controller",
        },
        observes: {
          kind: "source",
          selector: "attack",
        },
        target: {
          kind: "hero",
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "banish",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["deck"],
          position: "top",
          count: 1,
        },
        outputBinding: "banished",
      },
    },
  },
  onBanishGainLife: {
    kind: "static",
    staticKind: "triggered",
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
            and: [
              {
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
              {
                typeBox: {
                  types: ["Action"],
                },
              },
            ],
          },
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "gain-life",
        amount: 1,
        target: {
          selector: "controller",
        },
      },
    },
  },
} as const;
export const desiresOfFlesh = definePitchFamily(fabPitchFamilies["desires-of-flesh"], {
  keywords: [stealth],
  abilities: () => ({ ...abilities }),
});
export const {
  red: desiresOfFleshRed,
  yellow: desiresOfFleshYellow,
  blue: desiresOfFleshBlue,
} = desiresOfFlesh.cards;
