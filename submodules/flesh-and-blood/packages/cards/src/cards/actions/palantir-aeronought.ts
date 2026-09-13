import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/palantir-aeronought.generated.ts";

export const palantirAeronought = definePitchFamily(fabPitchFamilies["palantir-aeronought"], {
  abilities: () => ({
    defendingMustDefendEquipmentAble: {
      kind: "resolution",
      effect: {
        type: "rule-modification",
        mode: "require",
        action: "defend",
        filter: {
          typeBox: {
            types: ["Equipment"],
          },
        },
        duration: "this-combat-chain",
      },
    },
    thricePerTurnInstantTapCogGets1PowerThirdTimeActivatedAbilityDestroyDefending: {
      kind: "activated",
      limit: {
        count: 3,
        per: "turn",
      },
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "tap",
        filter: {
          typeBox: {
            subtypes: ["Cog"],
          },
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
          {
            type: "conditional",
            condition: {
              type: "compare-amount",
              amount: {
                type: "reference",
                binding: "times-activated-this-ability",
              },
              comparison: {
                op: "eq",
                value: 3,
              },
            },
            then: {
              type: "destroy",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "any",
                zones: ["combat-chain"],
                filter: {
                  defending: true,
                },
                count: 1,
              },
            },
          },
        ],
      },
    },
  }),
});

export const { red: palantirAeronoughtRed } = palantirAeronought.cards;
