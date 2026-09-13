import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bonds-of-attraction.generated.ts";

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
        type: "sequence",
        steps: [
          {
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
          {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["graveyard"],
              filter: {},
              count: 1,
            },
            outputBinding: "it",
          },
        ],
      },
    },
  },
  onBanishGainLife: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event-and-state",
      event: {
        name: "banish",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "none",
        },
      },
      state: {
        type: "has-status",
        status: "banished-another-card-with-same-color",
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

export const bondsOfAttraction = definePitchFamily(fabPitchFamilies["bonds-of-attraction"], {
  keywords: [stealth],
  abilities: () => ({ ...abilities }),
});

export const {
  red: bondsOfAttractionRed,
  yellow: bondsOfAttractionYellow,
  blue: bondsOfAttractionBlue,
} = bondsOfAttraction.cards;
