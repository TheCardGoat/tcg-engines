import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/essence-of-ancestry-body.generated.ts";

import { ward } from "../shared/keywords.ts";

export const essenceOfAncestryBody = definePitchFamily(
  fabPitchFamilies["essence-of-ancestry-body"],
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
              color: ["red"],
            },
          },
        },
      },
    }),
  },
);
export const { red: essenceOfAncestryBodyRed } = essenceOfAncestryBody.cards;
