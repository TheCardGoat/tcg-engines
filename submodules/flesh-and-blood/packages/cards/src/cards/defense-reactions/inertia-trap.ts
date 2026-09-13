import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/inertia-trap.generated.ts";

export const inertiaTrap = definePitchFamily(fabPitchFamilies["inertia-trap"], {
  supertypeSets: [["Assassin"], ["Ranger"]],
  abilities: () => ({
    inertiaOnBoostedAttack: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
        state: {
          type: "object-numeric-comparison",
          target: { selector: "this-attack" },
          property: "power",
          left: "current",
          op: "gt",
          right: "base",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "inertia",
          controller: "opponent",
        },
      },
    },
  }),
});

export const { red: inertiaTrapRed } = inertiaTrap.cards;
