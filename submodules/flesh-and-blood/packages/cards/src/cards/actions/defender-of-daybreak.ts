import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/defender-of-daybreak.generated.ts";
const abilities = {
  onDefendModifyNumericDefense: {
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
            typeBox: {
              supertypes: ["Shadow"],
            },
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
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              supertypes: ["Light"],
              excludeTypes: ["Equipment"],
            },
          },
          count: {
            type: "all",
          },
        },
        duration: "this-combat-chain",
      },
    },
  },
} as const;
export const defenderOfDaybreak = definePitchFamily(fabPitchFamilies["defender-of-daybreak"], {
  abilities: () => ({ ...abilities }),
});
export const {
  red: defenderOfDaybreakRed,
  yellow: defenderOfDaybreakYellow,
  blue: defenderOfDaybreakBlue,
} = defenderOfDaybreak.cards;
