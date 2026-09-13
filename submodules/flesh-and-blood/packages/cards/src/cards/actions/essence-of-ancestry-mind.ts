import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/essence-of-ancestry-mind.generated.ts";

import { ward } from "../shared/keywords.ts";

export const essenceOfAncestryMind = definePitchFamily(
  fabPitchFamilies["essence-of-ancestry-mind"],
  {
    keywords: [ward(2)],
    abilities: () => ({
      whenLeavesArenaIfControlNoIllusionistAurasNext: {
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
            type: "prevention",
            preventionKind: "fixed",
            amount: {
              type: "event-amount",
            },
            shielded: {
              selector: "controller",
            },
            duration: "this-turn",
            sourceFilter: {
              color: ["blue"],
            },
          },
        },
      },
    }),
  },
);
export const { blue: essenceOfAncestryMindBlue } = essenceOfAncestryMind.cards;
