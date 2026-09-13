import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/smoke-out.generated.ts";

export const smokeOut = definePitchFamily(fabPitchFamilies["smoke-out"], {
  abilities: () => ({
    markOnRedAttack: {
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
              color: ["red"],
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
          type: "mark",
          target: {
            selector: "attacking-hero",
          },
        },
      },
      label: {
        name: "mark",
      },
    },
  }),
});

export const { red: smokeOutRed } = smokeOut.cards;
