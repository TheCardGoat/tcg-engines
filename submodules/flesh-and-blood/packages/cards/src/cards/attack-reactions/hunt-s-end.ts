import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/hunt-s-end.generated.ts";

export const huntSEnd = definePitchFamily(fabPitchFamilies["hunt-s-end"], {
  abilities: () => ({
    requireFealtyTokens: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "zone-count",
        zone: "permanent",
        player: "controller",
        filter: {
          name: "Fealty",
          typeBox: {
            metatypes: ["Token"],
          },
        },
        comparison: {
          op: "gte",
          value: 3,
        },
      },
      playEffect: {
        role: "condition",
      },
    },
    boostDaggerAttack: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 4,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              subtypes: ["Dagger"],
            },
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
  }),
});

export const { red: huntSEndRed } = huntSEnd.cards;
