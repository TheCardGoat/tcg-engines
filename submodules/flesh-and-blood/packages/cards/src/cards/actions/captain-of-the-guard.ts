import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/captain-of-the-guard.generated.ts";

export const captainOfTheGuard = definePitchFamily(fabPitchFamilies["captain-of-the-guard"], {
  abilities: () => ({
    whileIsDefendingGreaterThanAttackTheyAreDefending: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "has-status",
        status: "defending",
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          zones: ["combat-chain"],
          filter: {
            defending: true,
            hasStatus: "power-greater-than-attack-defending",
          },
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
  }),
});
export const { blue: captainOfTheGuardBlue } = captainOfTheGuard.cards;
