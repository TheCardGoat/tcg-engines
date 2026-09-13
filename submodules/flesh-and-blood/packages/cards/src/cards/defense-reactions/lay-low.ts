import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/lay-low.generated.ts";

export const layLow = definePitchFamily(fabPitchFamilies["lay-low"], {
  abilities: () => ({
    cantPlayWhileMarked: {
      kind: "static",
      staticKind: "continuous",
      functionalZones: ["hand"],
      condition: {
        type: "is-marked",
        target: {
          selector: "controller",
        },
      },
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "play",
        filter: {
          name: "Lay Low",
        },
        duration: "while-condition",
      },
    },
    weakenNextAttack: {
      kind: "resolution",
      condition: {
        type: "is-marked",
        target: {
          selector: "attacking-hero",
        },
      },
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "attack",
            actor: {
              kind: "player",
              player: "opponent",
            },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              bindAs: "it",
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
            type: "modify-numeric",
            property: "power",
            op: "subtract",
            amount: 1,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
          },
        },
      },
    },
  }),
});

export const { yellow: layLowYellow } = layLow.cards;
