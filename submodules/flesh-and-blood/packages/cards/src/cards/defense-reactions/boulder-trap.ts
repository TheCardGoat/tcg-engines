import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/boulder-trap.generated.ts";

export const boulderTrap = definePitchFamily(fabPitchFamilies["boulder-trap"], {
  abilities: () => ({
    minusOneDefenseOnBoostedAttack: {
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
          type: "add-counter",
          counter: {
            kind: "numeric",
            value: -1,
            property: "defense",
          },
          count: 1,
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "attacking-hero",
            zones: ["permanent"],
            filter: {
              typeBox: {
                types: ["Equipment"],
              },
            },
            count: 1,
          },
        },
      },
    },
  }),
});

export const { yellow: boulderTrapYellow } = boulderTrap.cards;
