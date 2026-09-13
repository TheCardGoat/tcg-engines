import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/impulsive-desire.generated.ts";
import { stealth } from "../shared/keywords.ts";

const abilities = {
  triggeredHitBanish: {
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
  triggeredBanishGainLife: {
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
            or: [
              {
                typeBox: {
                  subtypes: ["Reaction"],
                },
              },
              {
                typeBox: {
                  types: ["Instant"],
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

export const impulsiveDesire = definePitchFamily(fabPitchFamilies["impulsive-desire"], {
  keywords: [stealth],
  abilities: () => ({ ...abilities }),
});

export const {
  red: impulsiveDesireRed,
  yellow: impulsiveDesireYellow,
  blue: impulsiveDesireBlue,
} = impulsiveDesire.cards;
