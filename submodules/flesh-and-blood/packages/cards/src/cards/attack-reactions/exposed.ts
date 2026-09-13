import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/exposed.generated.ts";

export const exposed = definePitchFamily(fabPitchFamilies["exposed"], {
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
          name: "Exposed",
        },
        duration: "while-condition",
      },
    },
    boostAttack: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
      label: {
        name: "mark",
      },
    },
    markDefendingHero: {
      kind: "resolution",
      effect: {
        type: "mark",
        target: {
          selector: "defending-hero",
        },
      },
      label: {
        name: "mark",
      },
    },
  }),
});

export const { blue: exposedBlue } = exposed.cards;
