import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bonds-of-memory.generated.ts";

import { stealth } from "../shared/keywords.ts";

const abilities = {
  onHitBanishGainLife: {
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
          {
            type: "conditional",
            condition: {
              type: "compare-amount",
              amount: {
                type: "count",
                what: "banished-this-way",
                groupBy: "name",
              },
              comparison: {
                op: "gte",
                value: 2,
              },
            },
            then: {
              type: "gain-life",
              amount: 1,
              target: {
                selector: "controller",
              },
            },
          },
        ],
      },
    },
  },
} as const;

export const bondsOfMemory = definePitchFamily(fabPitchFamilies["bonds-of-memory"], {
  keywords: [stealth],
  abilities: () => ({ ...abilities }),
});

export const {
  red: bondsOfMemoryRed,
  yellow: bondsOfMemoryYellow,
  blue: bondsOfMemoryBlue,
} = bondsOfMemory.cards;
