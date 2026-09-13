import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bash-guardian.generated.ts";

export const bashGuardian = definePitchFamily(fabPitchFamilies["bash-guardian"], {
  abilities: () => ({
    ifIsDefendedByGuardianGets1: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "has-status",
        status: "defended-by-guardian",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
    whenHitsGuardianHeroDestroyAuraTokenTheyControl: {
      kind: "static",
      staticKind: "triggered",
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
            filter: {
              typeBox: {
                supertypes: ["Guardian"],
              },
            },
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["permanent"],
            filter: {
              name: "Aura",
            },
            count: 1,
          },
        },
      },
    },
  }),
});
export const { red: bashGuardianRed } = bashGuardian.cards;
