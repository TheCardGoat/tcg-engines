import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/frailty-trap.generated.ts";

export const frailtyTrap = definePitchFamily(fabPitchFamilies["frailty-trap"], {
  supertypeSets: [["Assassin"], ["Ranger"]],
  abilities: () => ({
    frailtyOnGoAgainAttack: {
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
          type: "create-token",
          token: "frailty",
          creator: "effect-controller",
          controller: "opponent",
        },
      },
    },
  }),
});

export const { red: frailtyTrapRed } = frailtyTrap.cards;
