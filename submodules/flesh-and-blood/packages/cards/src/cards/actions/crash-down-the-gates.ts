import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/crash-down-the-gates.generated.ts";

export const crashDownTheGates = definePitchFamily(fabPitchFamilies["crash-down-the-gates"], {
  abilities: () => ({
    revealAndCompare: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
          target: { kind: "hero" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "reveal",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "compare-amount",
                amount: {
                  type: "subject-property",
                  property: "power",
                  basis: "current",
                  missing: "zero",
                },
                comparison: {
                  op: "gt",
                  value: { type: "reference", binding: "it", property: "power", missing: "zero" },
                },
              },
              then: {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 2,
                target: { selector: "self" },
                duration: "this-turn",
              },
            },
          ],
        },
      },
    },
    destroyDeckTop: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
          target: { kind: "hero" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "attack-target",
            zones: ["deck"],
            position: "top",
            count: 1,
          },
        },
      },
    },
  }),
});

export const {
  red: crashDownTheGatesRed,
  yellow: crashDownTheGatesYellow,
  blue: crashDownTheGatesBlue,
} = crashDownTheGates.cards;
