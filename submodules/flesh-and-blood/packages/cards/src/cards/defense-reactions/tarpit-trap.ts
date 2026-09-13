import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/tarpit-trap.generated.ts";

export const tarpitTrap = definePitchFamily(fabPitchFamilies["tarpit-trap"], {
  abilities: () => ({
    suppressNextHitTriggers: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "defended-attack",
            relationship: {
              kind: "any",
            },
            filter: {
              hasKeyword: "go-again",
            },
          },
          target: {
            kind: "any",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "event-object",
                selector: "attack",
                relationship: {
                  kind: "any",
                },
                filter: attackActionFilter(),
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "this-turn",
            matching: "first",
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "rule-modification",
              mode: "restrict",
              action: "trigger",
              duration: "this-turn",
            },
          },
        },
      },
    },
  }),
});

export const { yellow: tarpitTrapYellow } = tarpitTrap.cards;
