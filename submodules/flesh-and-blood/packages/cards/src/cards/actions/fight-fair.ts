import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fight-fair.generated.ts";

export const fightFair = definePitchFamily(fabPitchFamilies["fight-fair"], {
  abilities: () => ({
    ifIsDefendedByReviledGets1: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "has-status",
        status: "defended-by-reviled",
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
    whenHitsReviledHeroPutBottomOwnerSDeck: {
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
                supertypes: ["Reviled"],
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
          type: "move-card",
          target: {
            selector: "self",
          },
          to: {
            zone: "deck",
            position: "bottom",
          },
        },
      },
    },
  }),
});
export const { red: fightFairRed } = fightFair.cards;
