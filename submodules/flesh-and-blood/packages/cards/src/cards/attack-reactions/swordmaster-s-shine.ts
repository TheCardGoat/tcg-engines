import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/swordmaster-s-shine.generated.ts";

export const swordmasterSShine = definePitchFamily(fabPitchFamilies["swordmaster-s-shine"], {
  abilities: () => ({
    reduceCostForSwordCounters: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "cost-reduction",
        cost: {
          class: "asset",
          type: "resources",
          amount: {
            type: "count",
            what: "counters-on-objects",
            counter: {
              kind: "numeric",
              value: 1,
              property: "power",
            },
            filter: {
              typeBox: {
                subtypes: ["Sword"],
              },
            },
            player: "controller",
          },
        },
      },
    },
    boostWeaponAttack: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 5,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              types: ["Weapon"],
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

export const { red: swordmasterSShineRed } = swordmasterSShine.cards;
