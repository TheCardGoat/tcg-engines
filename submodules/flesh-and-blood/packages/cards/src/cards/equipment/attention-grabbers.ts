import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/attention-grabbers.generated.ts";

export const attentionGrabbers = defineCard(
  fabCardIdentitiesByCanonicalId["wGgcM7RtPfm8PtFhrcchm"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenDefendsMayRemoveSuspenseCounterFromAuraControl: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "defend",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "defender",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "remove-counters",
              counter: {
                kind: "named",
                name: "suspense",
              },
              count: 1,
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["permanent"],
                filter: {
                  typeBox: {
                    subtypes: ["Aura"],
                  },
                  hasCounter: "suspense",
                },
                count: 1,
              },
            },
            then: {
              type: "modify-numeric",
              property: "defense",
              op: "add",
              amount: 2,
              target: {
                selector: "self",
              },
              duration: "this-chain-link",
            },
          },
        },
      },
    },
  },
);
